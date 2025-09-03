<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Seller\BuildingApplication\BuildingApplicationController;



Route::prefix('seller/app')->name('seller.building.application.')->middleware('seller')->group(function () {
    Route::get('/', [BuildingApplicationController::class, 'index'])->name('index');
    Route::post('/submit', [BuildingApplicationController::class, 'store'])->name('store');
});