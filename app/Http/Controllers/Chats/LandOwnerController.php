<?php

namespace App\Http\Controllers\Chats;

use App\Events\Message\OwnerMessageSentToUser;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Events\Seller\MessageResponseFromAIEvent;
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
            ->with([
                'buildings' => function ($q) {
                    $q->select('id', 'name', 'image', 'seller_id');
                }
            ])
            ->select('id', 'name', 'avatar') // only what you need
            ->get();


        return response()->json(['owners' => $owners]);
    }

    public function fetchOwnerConversation($selectedOwnerId)
    {
        $authUserId = auth()->id();
        $owner = Seller::select('id', 'name', 'email', 'avatar', 'created_at')
            ->find($selectedOwnerId);

        if (!$owner) {
            return response()->json(['message' => 'Owner not found'], 404);
        }
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

        return response()->json([
            'owner' => $owner,
            'messages' => $messages
        ]);
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

        // 1️⃣ Create the user's message
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

        // 2️⃣ Fetch or create AI setting
        $settings = ConversationAiSetting::firstOrCreate([
            'seller_id' => $validated['receiver_id'],
            'user_id' => auth()->id(),
        ]);

        // 3️⃣ Only run AI if enabled
        if ($settings->ai_enabled) {
            $seller = $settings->seller;

            // Fetch minimal data upfront
            $beds = Bed::with(['bookings' => fn($q) => $q->where('status', 'completed'), 'features'])
                ->whereHas('room.building', fn($q) => $q->where('seller_id', $seller->id))
                ->get();

            $rooms = Room::with('features')
                ->whereHas('building', fn($q) => $q->where('seller_id', $seller->id))
                ->get();

            $buildings = Building::with('features')->where('seller_id', $seller->id)->get();

            $rulesAndRegulations = RulesAndRegulation::where('landowner_id', $seller->id)->get();

            // Only beds that are booked
            $bookedBeds = $beds->filter(fn($b) => $b->bookings->isNotEmpty())->values();

            // 4️⃣ Prepare dynamic context
            $context = $this->prepareDynamicContext(
                $seller,
                $beds,
                $rooms,
                $buildings,
                $rulesAndRegulations,
                $bookedBeds,
                $validated['content']
            );

            // 5️⃣ Ask GPT
            $aiResponse = $this->askGPT($validated['content'], $context);

            // 6️⃣ Save AI response
            $aiMessage = Message::create([
                'sender_id' => $seller->id,
                'sender_type' => Seller::class,
                'receiver_id' => auth()->id(),
                'receiver_type' => User::class,
                'content' => $aiResponse,
                'is_read' => false,
                'sent_at' => now(),
            ]);

            broadcast(new UserMessageSentToOwner($aiMessage));
            broadcast(new OwnerMessageSentToUser($aiMessage));
            broadcast(new MessageResponseFromAIEvent($aiMessage));
        }

        return response()->json(['message' => $message]);
    }

    private function prepareDynamicContext($seller, $beds, $rooms, $buildings, $rules, $bookedBeds, $userMessage)
    {
        $context = [
            'seller' => $seller->only(['id', 'name', 'email', 'phone', 'address'])
        ];

        $lowerMessage = strtolower($userMessage);

        foreach (['room', 'bed', 'availability'] as $word) {
            if (str_contains($lowerMessage, $word)) {
                $context['beds'] = $beds->toArray();
                $context['rooms'] = $rooms->toArray();
                $context['bookedBeds'] = $bookedBeds->toArray();
                break;
            }
        }

        foreach (['building', 'location', 'address'] as $word) {
            if (str_contains($lowerMessage, $word)) {
                $context['buildings'] = $buildings->toArray();
                break;
            }
        }

        foreach (['rule', 'regulation', 'policy'] as $word) {
            if (str_contains($lowerMessage, $word)) {
                $context['rules'] = $rules->toArray();
                break;
            }
        }


        return $context;
    }

    private function askGPT($userMessage, $context)
    {
        $apiKey = env('OPENAI_API_KEY');

        $promptParts = [
            "You are a helpful boarding house assistant. Answer concisely and kindly.",
            "Seller Info:\n" . json_encode($context['seller'], JSON_PRETTY_PRINT),
        ];

        if (!empty($context['buildings']))
            $promptParts[] = "Buildings:\n" . json_encode($context['buildings'], JSON_PRETTY_PRINT);
        if (!empty($context['rooms']))
            $promptParts[] = "Rooms:\n" . json_encode($context['rooms'], JSON_PRETTY_PRINT);
        if (!empty($context['beds']))
            $promptParts[] = "Beds:\n" . json_encode($context['beds'], JSON_PRETTY_PRINT);
        if (!empty($context['bookedBeds']))
            $promptParts[] = "Currently Booked Beds:\n" . json_encode($context['bookedBeds'], JSON_PRETTY_PRINT);
        if (!empty($context['rules']))
            $promptParts[] = "Rules:\n" . json_encode($context['rules'], JSON_PRETTY_PRINT);

        $promptParts[] = "User Question: {$userMessage}";

        $prompt = implode("\n\n", $promptParts);

        $response = Http::withHeaders([
            'Authorization' => "Bearer {$apiKey}",
        ])->post('https://api.openai.com/v1/chat/completions', [
                    'model' => 'gpt-5-mini',
                    'messages' => [
                        ['role' => 'system', 'content' => 'You are a boarding house assistant. Be concise and friendly.'],
                        ['role' => 'user', 'content' => $prompt],
                    ],
                    // 'max_completion_tokens' => 300,
                ]);

        Log::info('OpenAI Response:', $response->json());

        return $response->json('choices.0.message.content') ?? 'Sorry, I could not generate a response.';
    }

}
