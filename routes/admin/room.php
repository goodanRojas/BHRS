<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\Owner\Building\RoomController;

Route::prefix('admin/owner/building/room')->name('admin.owner.building.room.')->middleware('admin')->group(function () {
    Route::post('/add-feature', [RoomController::class, 'addRoomFeature'])->name('add.room.feature');
    Route::post('/add-room', [RoomController::class, 'addRoom'])->name('add.room');
    Route::get('/show/{id}', [RoomController::class, 'showRoom'])->name('show.room');
});
