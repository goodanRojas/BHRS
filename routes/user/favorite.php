<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\User\BedController;

Route::prefix('/favorite')->name('favorite')->middleware('auth')->group(function () {
    Route::get('/', [FavoriteController::class, 'index'])->name('index');
    Route::post('/bed/{bed}', [BedController::class, 'toggleFavoriteBed'])->name('toggle.from.bed');
    Route::post('/{id}/toggle', [FavoriteController::class, 'toggleFavorite'])->name('toggle');

});
