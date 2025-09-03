<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Seller\BedController;

Route::prefix('/seller')->name('seller.building.')->middleware('seller')->group(function () {
    Route::get('/home', [BedController::class, 'index'])->name('home');
    Route::get('/bed', [BedController::class, 'show'])->name('beds.show');
    Route::get('/bed/{bed}', [BedController::class, 'showBed'])->name('bed.details');

    Route::post('/bed/upload-image', [BedController::class, 'uploadImage'])->name('upload-image');
    Route::post('/bed/add-feature', [BedController::class, 'addBedFeature'])->name('add.bed.feature');
    Route::delete('/bed/delete-feature/{id}', [BedController::class, 'deleteFeature'])->name('delete.feature');
    Route::post('/bed/update-description', [BedController::class, 'updateDescription'])->name('update.description');
    
});

