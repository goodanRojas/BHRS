<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Seller\Profile\{SellerProfileController, PasswordController};

Route::middleware('seller')->group(function () {
    Route::prefix('/seller/profile')->name('seller.profile.')->middleware(['seller', 'check.has.subscription:bronze,silver,gold'])->group(function () {
        Route::get('/', [SellerProfileController::class, 'edit'])->name('edit');
        Route::post('/', [SellerProfileController::class, 'update'])->name('update');
        Route::delete('/', [SellerProfileController::class, 'destroy'])->name('destroy');
        Route::put('/address/update', [SellerProfileController::class, 'updateAddress'])->name('address.update');
        Route::put('/password', [PasswordController::class, 'update'])->name('password.update');
});
});
