<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Seller\SellerGuestController;

Route::prefix('seller/guest')->name('seller.guest.')->middleware('seller')->group(function () {
    Route::get('/', [SellerGuestController::class, 'index'])->name('index');
});