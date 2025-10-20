<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Seller\Guest\GuestHistoryController;

Route::prefix('seller/guest/history')->name('seller.guest.history.')->group(function () {
    Route::get('/', [GuestHistoryController::class, 'index'])->name('index');
    Route::get('/{id}', [GuestHistoryController::class, 'show'])->name('show');
});