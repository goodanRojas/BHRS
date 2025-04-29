<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FavoriteController;
use App\Http\Controllers\User\BedController;

Route::middleware('auth')->group(function () {
    Route::get('/favorites', [FavoriteController::class, 'index'])->name('favorites');
    Route::post('/beds/{bed}/favorite', [BedController::class, 'toggleFavoriteBed'])->name('to.user.seller.bed.favorite');
    Route::post('/favorites/{id}/toggle', [FavoriteController::class, 'toggleFavorite']);

});
