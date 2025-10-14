<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\Owner\Building\Buildings;
Route::prefix('admin/owner/buildings')->name('admin.owner.buildings.')->middleware('admin')->group(function () {
    Route::get('/', [Buildings::class, 'index'])->name('index');
    Route::get('/create', [Buildings::class, 'createShow'])->name('create.show');
    Route::post('/store', [Buildings::class, 'store'])->name('store');

    Route::get('/{id}', [Buildings::class, 'show'])->name('show');
    Route::post('/update/{building}', [Buildings::class, 'update'])->name('update');

    Route::post('/add-feature', [Buildings::class, 'addFeature'])->name('add.building.feature');
    Route::delete('/delete-feature/{id}', [Buildings::class, 'deleteFeature'])->name('delete.feature');

    Route::post('/add-room', [Buildings::class, 'addRoom'])->name('add.room');
    Route::post('/upload-image', [Buildings::class, 'uploadImage'])->name('upload-image');

    Route::post('/update-main-image/{building}', [Buildings::class, 'updateMainImage'])->name('update.main.image');
    Route::post('/update-image/{media}', [Buildings::class, 'updateCarouselImage'])->name('update.carousel.image');
    Route::post('/delete-image/{media}', [Buildings::class, 'deleteCarouselImage'])->name('delete.carousel.image');

    Route::post('/toggle/{building}', [Buildings::class, 'disable'])->name('disable');
});
