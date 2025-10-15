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

Broadcast::channel('admin-subscription-expired.{adminId}', function ($admin, $adminId) {
    return Auth::guard('admin')->check() && (int) $admin->id === (int) $adminId;
}, ['guards' => ['web', 'admin']]);

Broadcast::channel('online-users', function ($user){
    return ['id' => $user->id, 'name' => $user->name];
}, ['guards' => ['web', 'admin']]);
Broadcast::channel('online-sellers', function ($seller){
    return ['id' => $seller->id, 'name' => $seller->name];
}, ['guards' => ['seller', 'admin']]);

