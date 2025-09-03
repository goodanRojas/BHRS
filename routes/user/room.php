<?php

use App\Http\Controllers\User\RoomController;
use Illuminate\Support\Facades\Route;

Route::get('/home/rooms', [RoomController::class, 'showRooms'])->name('rooms.show');
Route::get('/home/rooms/more', [RoomController::class, 'showMoreRooms'])->name('rooms.show.more');

Route::get('/home/room/{room}', [RoomController::class, 'showToUserRoom'])->name('to.user.room.details');
 