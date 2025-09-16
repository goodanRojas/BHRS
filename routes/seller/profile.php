<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Seller\Profile\{SellerProfileController};

Route::middleware('seller')->group(function () {
    Route::prefix('/seller/profile')->name('seller.profile.')->middleware(['seller', 'check.has.subscription:bronze,silver,gold'])->group(function () {
        Route::get('/', [SellerProfileController::class, 'edit'])->name('edit');
        Route::post('/', [SellerProfileController::class, 'update'])->name('update');
        Route::delete('/', [SellerProfileController::class, 'destroy'])->name('destroy');
    });
});
