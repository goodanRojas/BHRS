<?php

namespace App\Http\Controllers\Seller\Message;

use App\Events\Message\OwnerMessageSentToUser;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth, Log, Http};
use Inertia\Inertia;
use App\Models\{AiResponseStatus, Message, Seller, User, Bed, ConversationAiSetting};

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

        $users = User::with('conversationAiSettings')->whereIn('id', $visibleUserIds)->get()
            ->map(function ($user) use ($authOwnerId) {
                $setting = $user->conversationAiSettings
                    ->where('seller_id', $authOwnerId)
                    ->first();

                $user->ai_response_status = [
                    'status' => $setting ? $setting->ai_enabled : false
                ];

                return $user;
            });

        return response()->json([
            'users' => $users
        ]);
    }

    public function sendMessage(Request $request)
    {
        $owner = auth()->guard('seller')->user();
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
        broadcast(new OwnerMessageSentToUser($message));

        ConversationAiSetting::firstOrCreate([
            'seller_id' => $owner->id, // seller is receiver in this case
            'user_id' => $validated['receiver_id']
        ]);


        return response()->json(['message' => $message]);
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

        $setting = ConversationAiSetting::firstOrCreate([
            'seller_id' => $ownerId,
            'user_id' => $userId,
        ]);

        $setting->ai_enabled = !$setting->ai_enabled;
        $setting->save();
        return response()->json(['ai_enabled' => $setting->ai_enabled]);
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


}
