<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Seller\PaymentDetailsController;

Route::prefix('seller/payment-details')->name('seller.payment-details.')->group(function () {
    Route::get('/', [PaymentDetailsController::class, 'index'])->name('index');
    Route::post('/save', [PaymentDetailsController::class, 'save'])->name('save');
});