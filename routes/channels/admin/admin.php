<?php

use Illuminate\Support\Facades\{Broadcast, Auth};

Broadcast::channel('admin-new-building-app.{adminId}', function ($admin, $adminId) {
    return Auth::guard('admin')->check() && (int) $admin->id === (int) $adminId;
}, ['guards' => ['web', 'admin']]);
