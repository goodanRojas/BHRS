<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Seller\Subscription\SubscriptionController;
Route::prefix('seller/subscription')->name('seller.subscription.')->middleware('seller')->group(function () {
    Route::get('/plan/{plan}', [SubscriptionController::class, 'choose'])->name('choose');
    Route::post('/store', [SubscriptionController::class, 'store'])->name('store');
    Route::get('/expired', [SubscriptionController::class, 'expired'])->name('expired');
    Route::get('/pending', [SubscriptionController::class, 'pending'])->name('pending');
    Route::get('/landing', [SubscriptionController::class, 'landing'])->name('landing');
    Route::get('/upgrade', [SubscriptionController::class, 'upgrade'])->name('upgrade');
    Route::get('/upgrade/choose/{plan}', [SubscriptionController::class, 'chooseUpgrade'])->name('choose.upgrade');
    Route::post('/upgrade/store', [SubscriptionController::class, 'storeUpgrade'])->name('upgrade.store');
});