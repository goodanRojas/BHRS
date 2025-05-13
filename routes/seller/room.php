<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Seller\RoomController;

Route::prefix('seller/room')->name('seller.room.')->middleware('seller')->group(function () {
  
Route::get('/', [RoomController::class, 'showRooms'])->name('show');
Route::get('/more', [RoomController::class, 'showMoreRooms'])->name('show.more');

Route::get('/{room}', [RoomController::class, 'showToUserRoom'])->name('room.details');
 
});
