<?php

use Illuminate\Support\Facades\{Broadcast, Auth};
use Illuminate\Support\Facades\Log;
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