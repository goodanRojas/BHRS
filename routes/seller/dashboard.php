<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Seller\SellerDashboardController;
use App\Http\Controllers\Seller\SellerAuthenticateController;

Route::prefix('seller/dashboard')->name('seller.dashboard.')->middleware(['seller', 'check.subscription:dashboard'])->group(function () {
    Route::get('/', [SellerDashboardController::class, 'index'])->name('index');
});
