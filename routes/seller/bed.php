<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Seller\BedController;

Route::prefix('/seller')->name('seller.building.')->middleware(['seller'])->group(function () {
    Route::get('/home', [BedController::class, 'index'])->name('home');
    Route::get('/bed', [BedController::class, 'show'])->name('beds.show');
    Route::get('/bed/{bed}', [BedController::class, 'showBed'])->name('bed.details');

    Route::post('/bed/upload-image', [BedController::class, 'uploadImage'])->name('upload-image');
    Route::post('/bed/add-feature', [BedController::class, 'addBedFeature'])->name('add.bed.feature');
    Route::delete('/bed/delete-feature/{id}', [BedController::class, 'deleteFeature'])->name('delete.feature');
    Route::post('/bed/update-description', [BedController::class, 'updateDescription'])->name('update.description');

    Route::post('/bed/update-main-image/{bed}', [BedController::class, 'updateMainImage'])->name('update.main.image');
    Route::post('/bed/update-image/{media}', [BedController::class, 'updateCarouselImage'])->name('update.carousel.image');
    Route::post('/bed/delete-image/{media}', [BedController::class, 'deleteCarouselImage'])->name('delete.carousel.image');

    Route::delete('/bed/delete/{bed}', [BedController::class, 'deleteBed'])->name('delete.bed');

    Route::post('/bed/update-name/{bed}', [BedController::class, 'updateName'])->name('update.name');
    Route::post('/bed/update-price/{bed}', [BedController::class, 'updatePrice'])->name('update.price');
});

