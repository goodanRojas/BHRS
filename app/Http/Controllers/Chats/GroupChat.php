<?php

namespace App\Http\Controllers\Chats;

use App\Http\Controllers\Controller;
use App\Models\{ChatGroup, User, ChatGroupMember, ChatGroupMessage};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class GroupChat extends Controller
{
    public function Index()
    {
        $userId = auth()->id();

        $groups = ChatGroup::whereHas('users', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })->orWhereHas('creator', function ($query) use ($userId){
            $query->where('creator_id', $userId);
        })->with([
            'messages.sender',
            'users'
        ])->get();
        Log::info($groups);
        return Inertia::render("Home/Messages/GroupChat", [
            'groups' => $groups
        ]);
    }

    public function SendMessage(Request $request)
    {
        $request->validate([
            'group_id' => 'required|exists:chat_groups,id',
            'content' => 'required|string|max:500',
        ]);

        $message = ChatGroupMessage::create([
            'group_id' => $request->group_id,
            'sender_id' => auth()->id(),
            'content' => $request->content,
            'is_read' => false,
            'sent_at' => now(),
        ]);

        return response()->json(['message' => $message], 201);
    }
}
