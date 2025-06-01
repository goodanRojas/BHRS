<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Seller\BuildingController;

Route::prefix('seller/building')->name('seller.building.')->middleware('seller')->group(function () {
    Route::get('/', [BuildingController::class, 'index'])->name('index');
    Route::get('/search', [BuildingController::class, 'searchBuildings'])->name('search.buildings');
    Route::get('/{building}', [BuildingController::class, 'showBuilding'])->name('show.building');
    Route::post('/add-feature', [BuildingController::class, 'addFeature'])->name('add.feature');
    Route::delete('/delete-feature/{id}', [BuildingController::class, 'deleteFeature'])->name('delete.feature');
    Route::post('/add-room', [BuildingController::class, 'addRoom'])->name('add.room');
});
