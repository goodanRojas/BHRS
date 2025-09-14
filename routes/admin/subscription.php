<?php

use App\Http\Controllers\Admin\Subscription\SubscriptionController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin/subscriptions')->name('admin.subscriptions.')->middleware('admin')->group(function () {
    Route::get('/', [SubscriptionController::class, 'index'])->name('index');
    Route::get('/{subscription}/show', [SubscriptionController::class, 'show'])->name('show');

    Route::get('/cancelled', [SubscriptionController::class, 'cancelled'])->name('cancelled');
    Route::get('/cancelled/{subscription}/show', [SubscriptionController::class, 'showCancelled'])->name('show.cancelled');

    Route::get('/pending', [SubscriptionController::class, 'pending'])->name('pending');
    Route::get('/pending/{subscription}/show', [SubscriptionController::class, 'showPending'])->name('show');

    Route::post('/{subscription}/confirm', [SubscriptionController::class, 'confirm'])->name('confirm');
    Route::post('/{subscription}/reject', [SubscriptionController::class, 'reject'])->name('reject');

});