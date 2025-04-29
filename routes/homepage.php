<?php

use App\Http\Controllers\HomePageController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use  App\Http\Controllers\User\BuildingController;
use  App\Http\Controllers\User\BedController;
use  App\Http\Controllers\User\RoomController;


Route::get('/', [HomePageController::class, 'index'])->name('home');
Route::get('/beds', [HomePageController::class, 'show'])->name('beds.show');

Route::get('/home/rooms', [RoomController::class, 'showRooms'])->name('rooms.show');
Route::get('/home/rooms/more', [RoomController::class, 'showMoreRooms'])->name('rooms.show.more');

Route::middleware('auth')->group(function () {
    Route::get('/buildings', [BuildingController::class, 'showToUserBuilding'])->name('to.user.buildings');
    Route::get('/buildings/{building}', [BuildingController::class, 'showToUserBuilding'])->name('to.user.building.details');
    Route::get('/rooms/{room}', [RoomController::class, 'showToUserRoom'])->name('to.user.seller.room.details');
    Route::get('/beds/{bed}', [BedController::class, 'showToUserBed'])->name('to.user.seller.bed.details');
    

    Route::get('/boarding-houses', [HomePageController::class, 'showMap']);
});
