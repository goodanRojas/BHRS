<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Seller\RoomController;

Route::prefix('seller/room')->name('seller.room.')->middleware('seller')->group(function () {

    Route::get('/', [RoomController::class, 'showRooms'])->name('show');
    Route::get('/more', [RoomController::class, 'showMoreRooms'])->name('show.more');

    Route::get('/{room}', [RoomController::class, 'showRoom'])->name('room.details');

    Route::post('/upload-image', [RoomController::class, 'uploadImage'])->name('upload-image');
    Route::post('/add-feature', [RoomController::class, 'addFeature'])->name('add.feature');
    Route::delete('/delete-feature/{id}', [RoomController::class, 'deleteFeature'])->name('delete.feature');

    Route::post('/add-bed', [RoomController::class, 'addBed'])->name('add.bed');
    Route::post('/update-description', [RoomController::class, 'updateDescription'])->name('update.description');

   Route::post('/update-main-image/{room}', [RoomController::class, 'updateMainImage'])->name('update.main.image');
    Route::post('/update-image/{media}', [RoomController::class, 'updateCarouselImage'])->name('update.carousel.image');
    Route::post('/delete-image/{media}', [RoomController::class, 'deleteCarouselImage'])->name('delete.carousel.image');

});
