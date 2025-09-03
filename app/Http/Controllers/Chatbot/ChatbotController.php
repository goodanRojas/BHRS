<?php

namespace App\Http\Controllers\Chatbot;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\{Message, User, Bed, Room, Seller};

class ChatbotController extends Controller
{

    // Display the chat page for a specific seller and bed
    public function showChat($sellerId, $bedId)
    {
        $seller = Seller::with('buildings')->findOrFail($sellerId);
        $bed = Bed::findOrFail($bedId);

        // Retrieve the messages between the user and seller for the specific bed
        $messages = Message::where(function ($query) use ($seller, $bed) {
            $query->where('sender_id', auth()->id())
                ->where('receiver_id', $seller->id);
        })
            ->orWhere(function ($query) use ($seller, $bed) {
                $query->where('sender_id', $seller->id)
                    ->where('receiver_id', auth()->id());
            })
            ->orderBy('created_at')
            ->get();

        return Inertia::render('Message/SellerChat', [
            'seller' => $seller,
            'bed' => $bed,
            'messages' => $messages,
        ]);
    }

    // Handle sending a message

    public function sendMessage(Request $request)
    {
        $request->validate([
            'message' => 'required|string|max:500',
            'receiver_id' => 'required|exists:sellers,id',
            'bed_id' => 'required|exists:beds,id',
        ]);

        $userId = auth()->id();
        $sellerId = $request->receiver_id;
        $bedId = $request->bed_id;
        $userMessage = $request->message;

        // 1. Save user message
        $userMessage = Message::create([
            'sender_id' => $userId,
            'sender_type' => User::class,
            'receiver_id' => $sellerId,
            'receiver_type' => Seller::class,
            'content' => $userMessage,
            'sent_at' => now(),
        ]);

        // 2. Prepare prompt for GPT using seller and bed data
        $seller = Seller::findOrFail($sellerId);
        $bed = Bed::findOrFail($bedId);
        $features = $bed->features;

        $featuresText = "Features:\n";
        foreach ($features as $feature) {
            $featuresText .= "- " . $feature->name;
            if ($feature->description) {
                $featuresText .= ": " . $feature->description;
            }
            $featuresText .= "\n";
        }

        $prompt = "You are a helpful assistant answering questions about a rental bed.\n";
        $prompt .= "Bed details:\n";
        $prompt .= "- Name: {$bed->name}\n";
        $prompt .= "- Price: {$bed->price}\n";
        $prompt .= $featuresText;   // <-- include features here
        $prompt .= "Seller info:\n";
        $prompt .= "- Name: {$seller->name}\n";
        $prompt .= "- Phone: {$seller->phone}\n";
        $prompt .= "User question: {$userMessage}\n";
        $prompt .= "Answer politely and informatively.";


        // 3. Call OpenAI API
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . env('OPENAI_API_KEY'),
            'Content-Type' => 'application/json',
        ])->post('https://api.openai.com/v1/chat/completions', [
            'model' => 'gpt-4o-mini',
            'messages' => [
                ['role' => 'system', 'content' => 'You are a helpful rental assistant.'],
                ['role' => 'user', 'content' => $prompt],
            ],
            'max_tokens' => 100,
            'temperature' => 0.7,
        ]);
        // Log::info($response);

        $botReplyText = $response->json('choices.0.message.content') ?? "Sorry, I couldn't generate a response.";


        // 4. Save GPT reply as a message from seller to user
        $botMessage = Message::create([
            'sender_id' => $sellerId,
            'sender_type' => Seller::class,
            'receiver_id' => $userId,
            'receiver_type' => User::class,
            'content' => $botReplyText,
            'sent_at' => now(),
        ]);

        // 5. Return both messages
        return response()->json([
            'botMessage' => $botMessage,
        ]);
    }
}
