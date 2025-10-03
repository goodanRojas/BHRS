<?php

use App\Http\Controllers\Admin\Notification\NotificationController;
use Illuminate\Support\Facades\Route;

Route::prefix('/admin/notification')->name('admin.notification.')->middleware('admin')->group(function () {
    Route::get('/mark-as-read/{message_id}/{notification_id}', [NotificationController::class, 'markAsRead'])->name('markAsRead');
    Route::get('/latest', [NotificationController::class, 'latest'])->name('latest');
    Route::get('/count', [NotificationController::class, 'count'])->name('count');
    Route::post('/mark-all-read', [NotificationController::class, 'markAllRead'])->name('markAllRead');
    Route::post('/{id}/mark-read', [NotificationController::class, 'markAsRead'])->name('markAsRead');
    Route::delete('/destroy-all/{type}', [NotificationController::class, 'destroyAll'])->name('destroyAll');
    Route::get('/{id?}', [NotificationController::class, 'index'])->name('index');
    Route::delete('/{id}', [NotificationController::class, 'destroy'])->name('destroy');

});