<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Seller\SellerHistoryController;
use App\Models\Seller;

Route::prefix('seller/history')->name('seller.history.')->middleware('seller')->group(function () {
    Route::get('/', [SellerHistoryController::class, 'index'])->name('index');
});