<?php

use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('user_booking_approved.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});
Broadcast::channel('user_payment_confirmed.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

Broadcast::channel('user_booking_expired.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

Broadcast::channel('App.Models.User.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});

Broadcast::channel('user_booking_rejected.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

Broadcast::channel('customer-support-response-channel.{userId}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
});

/* Chat: User to Owner */

Broadcast::channel('user-to-owner-messages.{id}', function ($owner, $ownerId) {
    return (int) $owner->id === (int) $ownerId;
},['guards' => ['seller']]);
