<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Seller\BuildingController;

Route::prefix('seller/building')->name('seller.building.')->middleware('seller')->group(function () {
    Route::get('/', [BuildingController::class, 'index'])->name('index');
   Route::get('/search', [BuildingController::class, 'searchBuildings'])->name('search.buildings');
   Route::get('/{building}', [BuildingController::class, 'showBuilding'])->name('show.building');
    
});
