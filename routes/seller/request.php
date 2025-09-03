<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Seller\SellerRequestController;
use App\Http\Controllers\Seller\Requests\{BedRequestController, PaymentInfo};

Route::prefix('seller/request/bed')->name('seller.request.bed.')->middleware('seller')->group(function () {
    Route::get('/{id}', [BedRequestController::class, 'show'])->name('show');
    Route::get('/', [BedRequestController::class, 'index'])->name('index');
     // Handle accept action
    Route::post('/{booking}/accept', [BedRequestController::class, 'accept'])->name('accept');
    Route::post('/accept/cash', [BedRequestController::class, 'acceptCash'])->name('accept.cash');
    // Handle reject action
    Route::post('/reject', [BedRequestController::class, 'reject'])->name('reject');

});


Route::prefix('seller/request/payments')->name('seller.request.payments.')->middleware('seller')->group(function () {
    Route::get('/', [PaymentInfo::class, 'index'])->name('index');
    Route::get('/{id}', [PaymentInfo::class, 'show'])->name('show');
    Route::post('/confirm', [PaymentInfo::class, 'confirm'])->name('confirm');
});