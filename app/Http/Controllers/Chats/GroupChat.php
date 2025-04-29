<?php

namespace App\Http\Controllers\Chats;

use App\Http\Controllers\Controller;
use App\Models\ChatGroupMember;
use App\Models\ChatGroupMessage;
use App\Models\ChatGroup;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class GroupChat extends Controller
{
    public function fetchGroupMessages(Request $request)
    {
        $userId = $request->user()->id;

        $groupIds = ChatGroupMember::where('user_id', $userId)->pluck('group_id');
     
        $groups = ChatGroup::with(['messages.sender', 'members'])
        ->whereIn('id', $groupIds)
        ->get();

        return response()->json([
            'groups' => $groups,
        ]);
        
       }

    public function fetchGroupConversation($groupId){
        $groups = ChatGroup::with(['messages.sender', 'members'])->findOrFail($groupId);
        return response()->json([
            'groups' => $groups,
        ]);
    }

    public function sendMessage(Request $request)
    {
        $request->validate([
            'group_id' => 'required|exists:chat_groups,id',
            'content' => 'required|string',
        ]);

     

        $message = ChatGroupMessage::create([
            'group_id' => $request->group_id,
            'sender_id' => auth()->id(),
            'content' => $request->content,
            'sent_at' => now(),
        ]);

        return response()->json([
            'message' => $message->load('sender'),
        ]);
    }
    
   
    public function createGroup(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
        ]);
    
        $group = ChatGroup::create([
            'name' => $request->name,
            'creator_id' => $request->user()->id,
        ]);
    
        $group->members()->attach($request->user()->id); // Add creator as member
        $group->load(['members', 'messages']); // Load members relation so frontend can access it
        return response()->json(['group' => $group]);
    }
    
    public function updateGroup(Request $request, $id)
    {
        $group = ChatGroup::findOrFail($id);
    
        if ($group->creator_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }
    
        $request->validate([
            'name' => 'required|string|max:255',
        ]);
    
        $group->update([
            'name' => $request->name,
        ]);
    
        return response()->json(['group' => $group]);
    }
    
    public function deleteGroup(Request $request, $id)
    {
        $group = ChatGroup::findOrFail($id);
    
        if ($group->creator_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }
    
        $group->delete();
    
        return response()->json(['message' => 'Group deleted successfully']);
    }
    
    public function addMember(Request $request, $id)
    {
        $group = ChatGroup::findOrFail($id);
    
        if ($group->creator_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }
    
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);
    
        $group->members()->attach($request->user_id);
    
        return response()->json(['message' => 'Member added successfully']);
    }
    
    public function removeMember(Request $request, $id)
    {
        $group = ChatGroup::findOrFail($id);
    
        if ($group->creator_id !== $request->user()->id) {
            abort(403, 'Unauthorized');
        }
    
        $request->validate([
            'user_id' => 'required|exists:users,id',
        ]);
    
        $group->members()->detach($request->user_id);
    
        return response()->json(['message' => 'Member removed successfully']);
    }
    

}
