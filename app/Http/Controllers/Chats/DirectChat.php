<?php

namespace App\Http\Controllers\Chats;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Events\MessageSent;
use App\Models\Message;
use Illuminate\Support\Facades\{Http, Log};
use Inertia\Inertia;
use App\Models\{User, Bed, Room, Seller};

class DirectChat extends Controller
{
    public function fetchUserMessages(Request $request)
    {
        $authUserId = $request->user()->id;

        $messages = Message::with(["sender", "receiver"])
            ->where('sender_id', $authUserId)
            ->orWhere('receiver_id', $authUserId)
            ->orderBy('created_at', 'asc')
            ->get()
            ->groupBy(function ($message) use ($authUserId) {
                return $message->sender_id === $authUserId
                    ? $message->receiver_id
                    : $message->sender_id;
            });


        return response()->json([
            'messages' => $messages,
        ]);
    }

    public function searchUsers(Request $request)
    {
        $query = $request->input('query');
        // Log::info('Search query: ' . $query);
        $users = User::where('name', 'LIKE', "%$query%")
            ->orWhere('email', 'LIKE', "%$query%")
            ->take(10)
            ->get();

        return response()->json(['users' => $users]);
    }

    public function fetchUserConversation($selectedUserId)
    {
        $authUserId = auth()->id(); // Get the currently authenticated user's ID

        // Optional: check if selected user exists
        $selectedUser = User::findOrFail($selectedUserId);



        $messages = Message::with(['sender', 'receiver'])
            ->where(function ($query) use ($authUserId, $selectedUserId) {
                $query->where('sender_id', $authUserId)
                    ->where('receiver_id', $selectedUserId);
            })
            ->orWhere(function ($query) use ($authUserId, $selectedUserId) {
                $query->where('sender_id', $selectedUserId)
                    ->where('receiver_id', $authUserId);
            })
            ->orderBy('created_at', 'asc')
            ->get();


        return response()->json([
            'messages' => $messages
        ]);
    }


    public function sendMessage(Request $request)
    {
        // Validate the request
        $validated = $request->validate([
            'receiver_id' => 'required|exists:users,id',
            'content' => 'required|string',
        ]);

        // Create a new message
        $message = Message::create([
            'sender_id' => auth()->id(),
            'sender_type' => User::class,
            'receiver_id' => $validated['receiver_id'],
            'receiver_type' => User::class,
            'content' => $validated['content'],
            'is_read' => false,
            'sent_at' => now(),
        ]);

        // Broadcast the message
        broadcast(new MessageSent($message));

        return response()->json(['message' => $message]);
    }

    public function getUsers(Request $request)
    {
        Log::info($request->all());
        // Validate the userIds parameter to ensure it is an array of integers
        $validated = $request->validate([
            'userIds' => 'required|array',
            'userIds.*' => 'integer|exists:users,id', // Ensure each ID is an integer and exists in the 'users' table
        ]);

        // Retrieve the userIds from the request
        $userIds = $validated['userIds'];

        // Get the user details for the provided user IDs
        $users = User::whereIn('id', $userIds)->get();

        // Return the user details in JSON format
        return response()->json([
            'users' => $users
        ]);
    }

    public function chatWithSeller($sellerId, $bedId)
    {
        // Fetch seller and bed details
        $seller = Seller::findOrFail($sellerId);
        $bed = Bed::with('room.building.features')->findOrFail($bedId);

        // Prepare GPT input (querying GPT using the seller and bed context)
        $gptInput = $this->prepareSellerContext($seller, $bed);
        $gptResponse = $this->askGPT("Tell the user about the seller's bed and room", $gptInput);

        // Return data to DirectChat with GPT response included
        return Inertia::render('DirectChat', [
            'seller' => $seller,
            'bed' => $bed,
            'gptResponse' => $gptResponse,  // Add the chatbot's response here
        ]);
    }
    private function prepareSellerContext($seller, $bed)
    {
        return [
            'seller' => $seller->only(['name', 'email', 'phone', 'address']),
            'bed' => $bed ? $bed->toArray() : null,
        ];
    }
    private function askGPT($userMessage, $context)
    {
        $apiKey = env('OPENAI_API_KEY'); // Get your API key from .env

        $prompt = "You are a helpful assistant for a boarding house owner. Answer the user based on the following seller and item data:\n\n"
            . "Seller Info:\n" . json_encode($context['seller'], JSON_PRETTY_PRINT) . "\n\n"
            . "Item Info:\n" . json_encode($context['bed'], JSON_PRETTY_PRINT) . "\n\n"
            . "User's Question: {$userMessage}";

        $response = Http::withHeaders([
            'Authorization' => "Bearer {$apiKey}",
        ])->post('https://api.openai.com/v1/chat/completions', [
            'model' => 'gpt-3.5-turbo',
            'messages' => [
                ['role' => 'system', 'content' => 'You are a boarding house assistant for a landlord.'],
                ['role' => 'user', 'content' => $prompt],
            ],
            'temperature' => 0.7,
            'max_tokens' => 300,
        ]);

        return $response->json('choices.0.message.content') ?? 'Sorry, I could not generate a response.';
    }
}
