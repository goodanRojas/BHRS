<?php

use Illuminate\Support\Facades\{Broadcast, Auth};


Broadcast::channel('App.Models.Admin.{id}', function ($admin, $id) {
    return (int) $admin->id === (int) $id;
}, ['guards' => ['web', 'admin']]);

Broadcast::channel('admin-new-building-app.{adminId}', function ($admin, $adminId) {
    return Auth::guard('admin')->check() && (int) $admin->id === (int) $adminId;
}, ['guards' => ['web', 'admin']]);

Broadcast::channel('admin-new-seller-application.{adminId}', function ($admin, $adminId) {
    return Auth::guard('admin')->check() && (int) $admin->id === (int) $adminId;
}, ['guards' => ['web', 'admin']]);
Broadcast::channel('admin-new-seller-subscription.{adminId}', function ($admin, $adminId) {
    return Auth::guard('admin')->check() && (int) $admin->id === (int) $adminId;
}, ['guards' => ['web', 'admin']]);
Broadcast::channel('admin-new-seller-upgrade-subscription.{adminId}', function ($admin, $adminId) {
    return Auth::guard('admin')->check() && (int) $admin->id === (int) $adminId;
}, ['guards' => ['web', 'admin']]);
