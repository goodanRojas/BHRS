<?php

namespace App\Http\Controllers\Chats;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Events\MessageSent;
use App\Models\Message;

use Inertia\Inertia;

class DirectChat extends Controller
{
    public function fetchUserMessages(Request $request)
    {
        $userId = $request->user()->id;

        $messages = Message::where('sender_id', $userId)
            ->orWhere('receiver_id', $userId)
            ->orderBy('sent_at', 'asc')
            ->get()
            ->groupBy('reciever_id');

        return response()->json([
            'messages' => $messages,
        ]);
    }
    public function searchUsers(Request $request)
    {
        $query = $request->input('query');

        $users = User::where('name', 'LIKE', "%$query%")
            ->orWhere('email', 'LIKE', "%$query%")
            ->take(10)
            ->get();

        return response()->json(['users' => $users]);
    }


    public function send(Request $request)
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
