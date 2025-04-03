<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\FavoriteController;

Route::middleware('auth')->group(function () {
    Route::get('/favorites', [FavoriteController::class, 'index'])->name('favorites');
});
