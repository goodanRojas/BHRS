<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Seller\SellerGuestController;
use App\Http\Controllers\Seller\SellerGuestRequestController;
Route::middleware('seller')->group(function () {
   Route::get('/guest/dashboard', [SellerGuestController::class, 'show'])->name('seller.guest.dashboard');
   
   Route::get('/guest/request', [SellerGuestRequestController::class, 'index'])->name('seller.guest.request.index');
   Route::get('/guest/request/{id}', [SellerGuestRequestController::class, 'show'])->name('seller.guest.request.show');
   Route::post('/guest/request/{id}', [SellerGuestRequestController::class, 'update'])->name('seller.guest.request.update');
});
