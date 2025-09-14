<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Seller\{BuildingController, BuildingRequestController};



Route::prefix('seller/building/requests')->name('seller.building.requests.')->middleware('seller')->group(function () {
    Route::get('', [BuildingRequestController::class, 'index'])->name('index');
    Route::post('/{id}/cancel', [BuildingRequestController::class, 'cancel'])->name('cancel');
});

Route::prefix('seller/building')->name('seller.building.')->middleware('seller')->group(function () {
    Route::get('/', [BuildingController::class, 'index'])->name('index');
    Route::get('/search', [BuildingController::class, 'searchBuildings'])->name('search.buildings');
    Route::get('/{building}', [BuildingController::class, 'showBuilding'])->name('show.building');
    Route::put('/update/{building}', [BuildingController::class, 'update'])->name('update');
    Route::post('/add-feature', [BuildingController::class, 'addFeature'])->name('add.feature');
    Route::delete('/delete-feature/{id}', [BuildingController::class, 'deleteFeature'])->name('delete.feature');
    Route::post('/add-room', [BuildingController::class, 'addRoom'])->name('add.room');
    Route::post('/upload-image', [BuildingController::class, 'uploadImage'])->name('upload-image');
   
    Route::post('/update-main-image/{building}', [BuildingController::class, 'updateMainImage'])->name('update.main.image');
    Route::post('/update-image/{media}', [BuildingController::class, 'updateCarouselImage'])->name('update.carousel.image');
    Route::post('/delete-image/{media}', [BuildingController::class, 'deleteCarouselImage'])->name('delete.carousel.image');
});
