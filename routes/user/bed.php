<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\BedController;

Route::middleware('auth')->group(function () {

    Route::get('/home', [BedController::class, 'index'])->name('home');
    Route::get('/home/beds', [BedController::class, 'show'])->name('beds.show');
    Route::get('/home/bed/{bed}', [BedController::class, 'showBed'])->name('to.user.seller.bed.details');
});


require __DIR__ . '/accommodation.php';
require __DIR__ . '/booking.php';
require __DIR__ . '/building.php';
require __DIR__ . '/favorite.php';
require __DIR__ . '/map.php';
require __DIR__ . '/message.php';
require __DIR__ . '/notification.php';
require __DIR__ . '/room.php';
require __DIR__ . '/profile.php';
require __DIR__ . '/onboarding.php';
require __DIR__ . '/feedback.php';