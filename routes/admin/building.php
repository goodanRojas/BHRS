<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\Owner\Building\Application;
use App\Http\Controllers\Admin\Owner\Building\Buildings;

Route::prefix('admin/owner/building/application')->name('admin.owner.building.application.')->middleware('admin')->group(function () {
    Route::get('/', [Application::class, 'index'])->name('index');
    Route::post('/approve', [Application::class, 'store'])->name('store');
});

Route::prefix('admin/owner/buildings')->name('admin.owner.buildings.')->middleware('admin')->group(function () {
    Route::get('/', [Buildings::class, 'index'])->name('index');
    Route::get('/create', [Buildings::class, 'createShow'])->name('create.show');
    Route::post('/store', [Buildings::class, 'store'])->name('store');

    Route::get('/{id}', [Buildings::class, 'show'])->name('show');

    Route::post('/add-feature', [Buildings::class, 'addFeature'])->name('add.building.feature');
    Route::delete('/delete-feature/{id}', [Buildings::class, 'deleteFeature'])->name('delete.feature');

    Route::post('/room/add-feature', [Buildings::class, 'addRoomFeature'])->name('add.room.feature');
    Route::post('/add-room', [Buildings::class, 'addRoom'])->name('add.room');
    Route::get('/show-room/{id}', [Buildings::class, 'showRoom'])->name('show.room');

    Route::post('/bed/add-feature', [Buildings::class, 'addBedFeature'])->name('add.bed.feature');
    Route::post('/add-bed', [Buildings::class, 'addBed'])->name('add.bed');
    Route::get('/show-bed/{id}', [Buildings::class, 'showBed'])->name('show.bed');
});
