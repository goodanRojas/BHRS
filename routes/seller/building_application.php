<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Seller\BuildingApplication\BuildingApplicationController;
use App\Http\Controllers\Seller\{BuildingRequestController};



Route::prefix('seller/building/requests')->name('seller.building.requests.')->middleware(['seller', 'check.has.subscription:bronze,silver'])->group(function () {
    Route::get('', [BuildingRequestController::class, 'index'])->name('index');
    Route::post('/{id}/cancel', [BuildingRequestController::class, 'cancel'])->name('cancel');
});
Route::prefix('seller/app')->name('seller.building.application.')->middleware(['seller', 'check.has.subscription:silver,gold'])->group(function () {
    Route::get('/', [BuildingApplicationController::class, 'index'])->name('index');
    Route::post('/submit', [BuildingApplicationController::class, 'store'])->name('store');
});
