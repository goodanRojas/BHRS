<?php

namespace App\Http\Controllers\Chats;

use App\Events\GroupMessageSent;
use App\Http\Controllers\Controller;
use App\Models\{ChatGroup, User, ChatGroupMember, ChatGroupMessage};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Log};
use Inertia\Inertia;
use Carbon\Carbon;

class GroupChat extends Controller
{
    public function index()
    {
        $userId = auth()->id();

        $groups = ChatGroup::whereHas('members', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })
            ->with([
                'messages.sender', // eager load messages and their sender
                'members'          // eager load group members
            ])
            ->get();
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
            'sent_at' => Carbon::now(), // Use Carbon for timestamp
        ]);
        broadcast(new GroupMessageSent($message, $request->tempId))->toOthers();

        

        return response()->json(['message' => $message], 201);
    }
}
