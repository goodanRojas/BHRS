<?php

namespace App\Http\Controllers\Chats;

use App\Events\Message\OwnerMessageSentToUser;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Events\Message\UserMessageSentToOwner;
use Illuminate\Support\Facades\{Http, Log};
use Inertia\Inertia;
use App\Models\{Message, User, Bed, Room, Building, Seller, ConversationAiSetting, RulesAndRegulation, Booking};

class LandOwnerController extends Controller
{
    public function fetchOwnerMessages(Request $request)
    {
        $authUserId = $request->user()->id;

        $messages = Message::with(["sender", "receiver"])
            ->where(function ($query) use ($authUserId) {
                $query->where(function ($q) use ($authUserId) {
                    $q->where('sender_id', $authUserId)
                        ->where(function ($q2) use ($authUserId) {
                            $q2->whereNull('hidden_by_sender_id')
                                ->orWhere('hidden_by_sender_id', '!=', $authUserId);
                        });
                })->orWhere(function ($q) use ($authUserId) {
                    $q->where('receiver_id', $authUserId)
                        ->where(function ($q2) use ($authUserId) {
                            $q2->whereNull('hidden_by_receiver_id')
                                ->orWhere('hidden_by_receiver_id', '!=', $authUserId);
                        });
                });
            })
            ->where('sender_type', User::class)
            ->orderBy('created_at', 'asc')
            ->get()
            ->groupBy(function ($message) use ($authUserId) {
                return $message->sender_id === $authUserId
                    ? $message->receiver_id
                    : $message->sender_id;
            });
        Log::info($messages);
        return response()->json([
            'messages' => $messages,
        ]);
    }
    public function searchOwners(Request $request)
    {
        $query = $request->input('query');
        // Log::info('Search query: ' . $query);

        $owners = Seller::where(function ($q) use ($query) {
            $q->where('name', 'like', '%' . $query . '%')
                ->orWhereHas('buildings', function ($q) use ($query) {
                    $subQuery = $q->where('name', 'like', '%' . $query . '%');
                });
        })
            ->with(['buildings' => function ($q) {
                $q->select('id', 'name', 'image', 'seller_id');
            }])
            ->select('id', 'name', 'avatar') // only what you need
            ->get();


        return response()->json(['owners' => $owners]);
    }

    public function fetchOwnerConversation($selectedOwnerId)
    {
        $authUserId = auth()->id();

        $messages = Message::with(['sender', 'receiver'])
            ->where(function ($query) use ($authUserId, $selectedOwnerId) {
                $query->where(function ($q) use ($authUserId, $selectedOwnerId) {
                    $q->where('sender_id', $authUserId)
                        ->where(function ($q2) use ($selectedOwnerId) {
                            $q2->where('receiver_id', $selectedOwnerId)
                                ->where('receiver_type', Seller::class);
                        })
                        ->whereNull('sender_deleted_at');
                })->orWhere(function ($q) use ($authUserId, $selectedOwnerId) {
                    $q->where('sender_id', $selectedOwnerId)
                        ->where('sender_type', Seller::class)
                        ->where('receiver_id', $authUserId)
                        ->whereNull('receiver_deleted_at');
                });
            })
            ->orderBy('created_at', 'asc')
            ->get();

        return response()->json(['messages' => $messages]);
    }








    public function getOwners(Request $request)
    {
        $authUserId = $request->user()->id;

        $validated = $request->validate([
            'ownerIds' => 'required|array',
            'ownerIds.*' => 'integer|exists:sellers,id',
        ]);

        $ownerIds = $validated['ownerIds'];
        // Log::info('Owner IDs: ' . implode(', ', $ownerIds));

        // Get only conversations that are not soft-deleted by the current user
        $visibleOwnerIds = Message::where(function ($query) use ($authUserId) {
            $query->where(function ($q) use ($authUserId) {
                $q->where('sender_id', $authUserId)
                    ->whereNull('sender_deleted_at');
            })->orWhere(function ($q) use ($authUserId) {
                $q->where('receiver_id', $authUserId)
                    ->whereNull('receiver_deleted_at');
            });
        })
            ->where(function ($query) use ($ownerIds) {
                $query->whereIn('sender_id', $ownerIds)
                    ->orWhereIn('receiver_id', $ownerIds);
            })
            ->where(function ($query) {
                $query->where('sender_type', Seller::class)
                    ->orWhere('receiver_type', Seller::class);
            })
            ->get()
            ->map(function ($message) use ($authUserId) {
                return $message->sender_id === $authUserId
                    ? $message->receiver_id
                    : $message->sender_id;
            })
            ->unique()
            ->values();

        $owners = Seller::whereIn('id', $visibleOwnerIds)->get();

        return response()->json([
            'owners' => $owners
        ]);
    }


    public function deleteConversation($selectedUserId)
    {
        $currentUserId = auth()->id();

        // Fetch messages where current user is sender or receiver
        $messages = Message::where(function ($query) use ($currentUserId, $selectedUserId) {
            $query->where(function ($q) use ($currentUserId, $selectedUserId) {
                $q->where('sender_id', $currentUserId)
                    ->where('receiver_id', $selectedUserId);
            })->orWhere(function ($q) use ($currentUserId, $selectedUserId) {
                $q->where('sender_id', $selectedUserId)
                    ->where('receiver_id', $currentUserId);
            });
        })->get();

        foreach ($messages as $message) {
            if ($message->sender_id == $currentUserId && !$message->sender_deleted_at) {
                $message->sender_deleted_at = now();
            }
            if ($message->receiver_id == $currentUserId && !$message->receiver_deleted_at) {
                $message->receiver_deleted_at = now();
            }
            $message->save();
        }

        return response()->json(['message' => 'Conversation hidden from your view.']);
    }


    public function sendMessage(Request $request)
    {
        
        $validated = $request->validate([
            'receiver_id' => 'required|exists:sellers,id',
            'content' => 'required|string',
        ]);

        // Create a new message
        $message = Message::create([
            'sender_id' => auth()->id(),
            'sender_type' => User::class,
            'receiver_id' => $validated['receiver_id'],
            'receiver_type' => Seller::class,
            'content' => $validated['content'],
            'is_read' => false,
            'sent_at' => now(),
        ]);

        $message->load(['sender', 'receiver']);
        broadcast(new UserMessageSentToOwner($message));

        $settings = ConversationAiSetting::firstOrCreate([
            'seller_id' => $validated['receiver_id'], // seller is receiver in this case
            'user_id'   => auth()->id(),
            'ai_enabled' => false
        ]);

        Log::info($settings);
        if ($settings->ai_enabled) {
            $seller = $settings->seller;

            $beds = Bed::with(['bookings.ratings'])
                ->whereHas('room.building', function ($q) use ($seller) {
                    $q->where('seller_id', $seller->id);
                })->get();
            $rooms = Room::whereHas('building', function ($q) use ($seller) {
                $q->where('seller_id', $seller->id);
            })->get(); // This gets the rooms for the seller

            $buildings = Building::where('seller_id', $seller->id)->get();
            $rulesAndRegulations = RulesAndRegulation::where('landowner_id', $seller->id)->get(); // THis gets the rules and regulations for the building
            $areBedsBooked = Booking::where('bookable_type', Bed::class)
                ->whereIn('bookable_id', $beds->pluck('id')
                    ->where('status', 'completed'))
                ->get();
            $context = $this->prepareSellerContext($seller, $beds, $rooms, $buildings, $rulesAndRegulations, $areBedsBooked);

            $aiResponse = $this->askGPT($validated['content'], $context);

            $aiMessage = Message::create([
                'sender_id'     => $seller->id,
                'sender_type'   => Seller::class,
                'receiver_id'   => auth()->id(),
                'receiver_type' => User::class,
                'content'       => $aiResponse,
                'is_read'       => false,
                'sent_at'       => now(),
            ]);
            broadcast(new UserMessageSentToOwner($aiMessage));
            broadcast(new OwnerMessageSentToUser($aiMessage));
        }
        return response()->json(['message' => $message]);
    }
    private function prepareSellerContext($seller, $beds, $rooms, $buildings, $rulesAndRegulations, $areBedsBooked)
    {
        return [
            'seller' => $seller->only(['id', 'name', 'email', 'phone', 'address']),
            'beds' => $beds->toArray(),
            'rooms' => $rooms->toArray(),
            'buildings' => $buildings->toArray(),
            'rules' => $rulesAndRegulations->toArray(),
            'bookedBeds' => $areBedsBooked->toArray(),
        ];
    }
    private function askGPT($userMessage, $context)
    {
        $apiKey = env('OPENAI_API_KEY'); // Get your API key from .env

        $prompt = "You are a helpful boarding house assistant. Use the seller’s data below to answer the question.\n\n"
            . "Seller Info:\n" . json_encode($context['seller'], JSON_PRETTY_PRINT) . "\n\n"
            . "Buildings:\n" . json_encode($context['buildings'], JSON_PRETTY_PRINT) . "\n\n"
            . "Rooms:\n" . json_encode($context['rooms'], JSON_PRETTY_PRINT) . "\n\n"
            . "Beds:\n" . json_encode($context['beds'], JSON_PRETTY_PRINT) . "\n\n"
            . "Rules:\n" . json_encode($context['rules'], JSON_PRETTY_PRINT) . "\n\n"
            . "Currently Booked:\n" . json_encode($context['bookedBeds'], JSON_PRETTY_PRINT) . "\n\n"
            . "User's Question: {$userMessage}";

        $response = Http::withHeaders([
            'Authorization' => "Bearer {$apiKey}",
        ])->post('https://api.openai.com/v1/chat/completions', [
            'model' => 'gpt-5-mini',
            'messages' => [
                ['role' => 'system', 'content' => 'You are a boarding house assistant. Be concise and friendly.'],
                ['role' => 'user', 'content' => $prompt],
            ],
            // 'temperature' => 0.7,
            'max_completion_tokens' => 300,
        ]);

        Log::info('OpenAI Response:', $response->json());

        return $response->json('choices.0.message.content') ?? 'Sorry, I could not generate a response.';
    }
}
