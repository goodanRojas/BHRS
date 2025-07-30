<?php

namespace App\Http\Controllers\Seller\Message;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth, Log};
use Inertia\Inertia;
use App\Models\{AiResponseStatus, Message, Seller, User};

class MessageController extends Controller
{
  



    public function searchUsers(Request $request)
    {
        $query = $request->input('query');
        // Log::info('Search query: ' . $query);

        $users = User::where('name', 'like', '%' . $query . '%')->get();


        return response()->json(['users' => $users]);
    }

    public function fetchUserConv($userId)
    {
        $authUserId = Auth::guard('seller')->id();

        $messages = Message::with(['sender', 'receiver'])
            ->where(function ($query) use ($authUserId, $userId) {
                $query->where(function ($q) use ($authUserId, $userId) {
                    $q->where('sender_id', $authUserId)
                        ->where(function ($q2) use ($userId) {
                            $q2->where('receiver_id', $userId)
                                ->where('receiver_type', User::class);
                        })
                        ->whereNull('sender_deleted_at');
                })->orWhere(function ($q) use ($authUserId, $userId) {
                    $q->where('sender_id', $userId)
                        ->where('sender_type', User::class)
                        ->where('receiver_id', $authUserId)
                        ->whereNull('receiver_deleted_at');
                });
            })
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json(['messages' => $messages]);
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
            'sender_id' => Auth::guard('seller')->id(),
            'sender_type' => Seller::class,
            'receiver_id' => $validated['receiver_id'],
            'receiver_type' => User::class,
            'content' => $validated['content'],
            'is_read' => false,
            'sent_at' => now(),
        ]);

        $message->load(['sender', 'receiver']);
        // Log::info($message);
        // Broadcast the message
        // broadcast(new MessageSent($message));    

        return response()->json(['message' => $message]);
    }

    public function getUsers(Request $request)
    {
        $authOwnerId = Auth::guard('seller')->id();



        $validated = $request->validate([
            'userIds' => 'required|array',
            'userIds.*' => 'integer|exists:users,id',
        ]);

        $userIds = $validated['userIds'];
        // Log::info('Owner IDs: ' . implode(', ', $userIds));

        // Get only conversations that are not soft-deleted by the current user
        $visibleUserIds = Message::where(function ($query) use ($authOwnerId) {
            $query->where(function ($q) use ($authOwnerId) {
                $q->where('sender_id', $authOwnerId)
                    ->whereNull('sender_deleted_at');
            })->orWhere(function ($q) use ($authOwnerId) {
                $q->where('receiver_id', $authOwnerId)
                    ->whereNull('receiver_deleted_at');
            });
        })
            ->where(function ($query) use ($userIds) {
                $query->whereIn('sender_id', $userIds)
                    ->orWhereIn('receiver_id', $userIds);
            })
            ->where(function ($query) {
                $query->where('sender_type', User::class)
                    ->orWhere('receiver_type', User::class);
            })
            ->get()
            ->map(function ($message) use ($authOwnerId) {
                return $message->sender_id === $authOwnerId
                    ? $message->receiver_id
                    : $message->sender_id;
            })
            ->unique()
            ->values();

        $users = User::with('aiResponseStatus')->whereIn('id', $visibleUserIds)->get();

        return response()->json([
            'users' => $users
        ]);
    }


    public function deleteConversation($selectedUserId)
    {
           $ownerId = Auth::guard('seller')->id();


        // Fetch messages where current user is sender or receiver
        $messages = Message::where(function ($query) use ($ownerId, $selectedUserId) {
            $query->where(function ($q) use ($ownerId, $selectedUserId) {
                $q->where('sender_id', $ownerId)
                    ->where('receiver_id', $selectedUserId);
            })->orWhere(function ($q) use ($ownerId, $selectedUserId) {
                $q->where('sender_id', $selectedUserId)
                    ->where('receiver_id', $ownerId);
            });
        })->get();

        foreach ($messages as $message) {
            if ($message->sender_id == $ownerId && !$message->sender_deleted_at) {
                $message->sender_deleted_at = now();
            }
            if ($message->receiver_id == $ownerId && !$message->receiver_deleted_at) {
                $message->receiver_deleted_at = now();
            }
            $message->save();
        }

        return response()->json(['message' => 'Conversation hidden from your view.']);
    }

    public function toggleAI(Request $request)
    {
        $ownerId = Auth::guard('seller')->id();
        $userId = $request->input('userId');

        $aiStatus = AiResponseStatus::where('seller_id', $ownerId)
            ->where('user_id', $userId)
            ->first();
        if ($aiStatus) {
            $aiStatus->status = !$aiStatus->status; // Toggle the status
            $aiStatus->save();
            return response()->json(['status' => $aiStatus->status]);
        }
        // If no record exists, create a new one with status true
        AiResponseStatus::create([
            'seller_id' => $ownerId,
            'user_id' => $userId,
            'status' => true, // Default to true when creating a new record
        ]);
        return response()->json(['status' => true]);
    }
    public function ownerMessages(Request $request)
    {
        $ownerId = Auth::guard('seller')->id();
        $sentMessages = Message::where('sender_id', $ownerId)
            ->where('sender_type', Seller::class)
            ->where('receiver_type', User::class)
            ->get();

        // Query received messages where sender_type or receiver_type is User::class, excluding Seller::class
        $receivedMessages = Message::where('receiver_id', $ownerId)
            ->where('receiver_type', Seller::class)
            ->where('sender_type', User::class)
            ->get();

        return Inertia::render('Seller/Message/Index', [
            'sentMessages' => $sentMessages,
            'receivedMessages' => $receivedMessages,
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
