<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use  App\Http\Controllers\Seller\BuildingController;
use  App\Http\Controllers\Seller\BedController;
use  App\Http\Controllers\Seller\RoomController;

Route::middleware('seller')->group(function () {
    Route::get('/seller/buildings', [BuildingController::class, 'show'])->name('seller.buildings');
    Route::get('/seller/buildings/{building}', [BuildingController::class, 'show'])->name('seller.building.details');
    Route::get('/seller/rooms/{room}', [RoomController::class, 'show'])->name('seller.room.details');
    Route::get('/seller/beds/{bed}', [BedController::class, 'show'])->name('seller.bed.details');
});
