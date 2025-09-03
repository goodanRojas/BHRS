<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Seller\MapController;

Route::prefix('seller/building/map')->name('seller.building.map.')->middleware('seller')->group(function () {
    Route::get('/{building}', [MapController::class, 'index'])->name('index');
});