<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Seller\BedController;

Route::prefix('/seller/building')->name('seller.building.')->middleware('seller')->group(function () {
    Route::get('/home', [BedController::class, 'index'])->name('home');
    Route::get('/bed', [BedController::class, 'show'])->name('beds.show');
    Route::get('/bed/{bed}', [BedController::class, 'showBed'])->name('bed.details');
});
