<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Seller\Notification\SellerNotificationController;
Route::prefix('seller/notifications')->name('seller.notifications.')->middleware('seller')->group(function () {
    Route::get('/latest', [SellerNotificationController::class, 'latest'])->name('lastest');
});