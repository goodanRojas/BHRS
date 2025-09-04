<?php

use Illuminate\Support\Facades\Broadcast;
use App\Models\ChatGroup;
use Illuminate\Support\Facades\Log;


Broadcast::channel('direct-messages.{id}', function ($user, $userId) {
    return (int) $user->id === (int) $userId;
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



require __DIR__ . '/channels/owner/owner.php';
require __DIR__ . '/channels/user/user.php';
require __DIR__ . '/channels/admin/admin.php';