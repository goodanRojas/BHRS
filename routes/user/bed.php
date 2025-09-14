<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\BedController;

Route::middleware('auth')->group(function () {

    Route::get('/home', [BedController::class, 'index'])->name('home');
    Route::get('/home/beds', [BedController::class, 'show'])->name('beds.show');
    Route::get('/home/bed/{bed}', [BedController::class, 'showBed'])->name('to.user.seller.bed.details');
});
