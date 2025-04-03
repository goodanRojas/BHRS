<?php

namespace App\Http\Controllers\Chats;

use App\Http\Controllers\Controller;
use App\Models\ChatGroupMember;
use App\Models\ChatGroupMessage;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class GroupChat extends Controller
{
    public function fetchGroupMessages(Request $request)
    {
        $userId = $request->user()->id;

        $groupIds = ChatGroupMember::where('user_id', $userId)->pluck('group_id');
        Log::info("Fetching group messages for user {$userId} in groups: " . implode(',', $groupIds->toArray()));
    
        $messages = ChatGroupMessage::whereIn('group_id', $groupIds)
            ->orderBy('sent_at', 'asc')
            ->get()
            ->groupBy('group_id');
    }
}
