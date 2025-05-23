<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Seller\SellerRequestController;
use App\Http\Controllers\Seller\Requests\BedRequestController;


Route::prefix('seller/request')->name('seller.request.')->middleware('seller')->group(function () {
    Route::get('/', [SellerRequestController::class, 'index'])->name('index');
    
});

Route::prefix('seller/request/bed')->name('seller.request.bed.')->middleware('seller')->group(function () {
    Route::get('/{id}', [BedRequestController::class, 'index'])->name('index');
     // Handle accept action
    Route::post('/{booking}/accept', [BedRequestController::class, 'accept'])->name('accept');

    // Handle reject action
    Route::post('/reject', [BedRequestController::class, 'reject'])->name('reject');

});