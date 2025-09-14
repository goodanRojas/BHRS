<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Seller\Subscription\SubscriptionController;
Route::prefix('seller/subscription')->name('seller.subscription.')->group(function () {
    Route::middleware('check.pending.subscription')->group(function () {
        Route::get('/plan/{plan}', [SubscriptionController::class, 'choose'])->name('choose');
        Route::post('/store', [SubscriptionController::class, 'store'])->name('store');
    });
    Route::get('/expired', [SubscriptionController::class, 'expired'])->name('expired');
    Route::get('/pending', [SubscriptionController::class, 'pending'])->name('pending');
    Route::get('/landing', [SubscriptionController::class, 'landing'])->name('landing');

});