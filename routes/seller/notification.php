<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Seller\Notification\SellerNotificationController;

Route::prefix('seller/notifications')->name('seller.notifications.')->middleware(['seller', 'check.has.subscription:bronze,silver,gold'])->group(function () {
    Route::get('/', [SellerNotificationController::class, 'index'])->name('index');
    Route::get('/latest', [SellerNotificationController::class, 'latest'])->name('lastest');
    Route::get('count', [SellerNotificationController::class, 'count'])->name('count');
    Route::post('/mark-all-read', [SellerNotificationController::class, 'markAllRead'])->name('markAllRead');
    Route::post('/{id}/mark-read', [SellerNotificationController::class, 'markAsRead'])->name('markAsRead');
    Route::delete('/destroy-all/{type}', [SellerNotificationController::class, 'destroyAll'])->name('destroyAll');
    Route::delete('/{id}', [SellerNotificationController::class, 'destroy'])->name('destroy');
});
