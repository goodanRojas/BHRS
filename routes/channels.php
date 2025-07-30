<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\ChatGroup;
use Illuminate\Support\Facades\Log;


Broadcast::channel('direct-messages.{id}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

Broadcast::channel('group-messages.{groupId}', function ($user, $groupId) {
    $exists = ChatGroup::where('id', $groupId)
        ->whereHas('members', function ($query) use ($user, $groupId) {
            $query->where('chat_group_members.user_id', $user->id)
                  ->where('chat_group_members.group_id', $groupId); // Ensure group_id is used here
        })
        ->exists();
        Log::info($exists);
    return $exists;
});

Broadcast::channel('favorites.{userId}', function ($user, $userId) {
    Log::info("the channel is triggered");
    Log::info($user->id);
    Log::info($userId);
    Log::info((int) $user->id === (int) $userId);
    return (int) $user->id === (int) $userId;
});
Broadcast::channel('landlord.{landlordId}', function ($seller, $landlordId) {
    return $seller->id === (int) $landlordId;
}, ['guards' => ['seller']]);


Broadcast::channel('user-status', function ($user) {
    return $user ? ['id' => $user->id, 'name' => $user->name] : false;
});

