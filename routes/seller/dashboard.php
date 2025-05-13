<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Seller\SellerDashboardController;
use App\Http\Controllers\Seller\SellerAuthenticateController;

Route::prefix('seller/dashboard')->name('seller.dashboard.')->middleware('auth:seller')->group(function () {
    Route::get('/', [SellerDashboardController::class, 'index'])->name('index');
});
