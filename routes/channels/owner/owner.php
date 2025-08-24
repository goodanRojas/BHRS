<?php

use Illuminate\Support\Facades\{Broadcast, Auth};

// Seller and Owner are the same.
Broadcast::channel('owner.{ownerId}', function ($owner, $ownerId) {
return Auth::guard('seller')->check() && (int) $owner->id === (int) $ownerId;
}, ['guards' => ['web', 'seller']]);


Broadcast::channel('owner_user_paid.{ownerId}', function ($owner, $ownerId) {
return Auth::guard('seller')->check() && (int) $owner->id === (int) $ownerId;
}, ['guards' => ['web', 'seller']]);
