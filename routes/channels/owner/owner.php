<?php

use Illuminate\Support\Facades\{Broadcast, Auth};
use Illuminate\Support\Facades\Log;
use App\Models\ChatGroup;
// Seller and Owner are the same.
Broadcast::channel('owner.{ownerId}', function ($owner, $ownerId) {
    return Auth::guard('seller')->check() && (int) $owner->id === (int) $ownerId;
}, ['guards' => ['web', 'seller']]);


Broadcast::channel('owner_user_paid.{ownerId}', function ($owner, $ownerId) {
    return Auth::guard('seller')->check() && (int) $owner->id === (int) $ownerId;
}, ['guards' => ['web', 'seller']]);

Broadcast::channel('to_owner_user_booking_expired.{ownerId}', function ($owner, $ownerId) {
    Log::info("Auth Seller: " . optional($owner)->id . " vs ownerId: " . $ownerId);

    return Auth::guard('seller')->check() && (int) $owner->id === (int) $ownerId;
}, ['guards' => ['web', 'seller']]);


Broadcast::channel('App.Models.Seller.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
}, ['guards' => ['web', 'seller']]);


/* Chat: Owner to User */
Broadcast::channel('owner-to-user-messages.{id}', function ($user, $userId) {
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

Broadcast::channel('seller-building-application-approved.{sellerId}', function ($seller, $sellerId) {
    return Auth::guard('seller')->check() && (int) $seller->id === (int) $sellerId;
}, ['guards' => ['web', 'seller']]);

Broadcast::channel('seller-subscription-confirmed.{sellerId}', function ($seller, $sellerId) {
    return Auth::guard('seller')->check() && (int) $seller->id === (int) $sellerId;
}, ['guards' => ['web', 'seller']]);
