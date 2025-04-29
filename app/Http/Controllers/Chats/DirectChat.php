<?php

namespace App\Http\Controllers\Chats;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Events\MessageSent;
use App\Models\Message;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

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
            'receiver_id' => $validated['receiver_id'],
            'content' => $validated['content'],
            'is_read' => false,
            'sent_at' => now(),
        ]);

        // Broadcast the message
        broadcast(new MessageSent($message));

        return response()->json(['message' => $message]);
    }
}
