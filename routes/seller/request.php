<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Seller\SellerRequestController;

Route::prefix('seller/request')->name('seller.request.')->middleware('seller')->group(function () {
    Route::get('/', [SellerRequestController::class, 'index'])->name('index');
});