<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Seller\SellerAuthenticateController;
use App\Http\Controllers\Seller\BuildingApplication\BuildingApplicationController;

Route::prefix('seller')->name('seller.')->group(function () {
        Route::get('/login', [SellerAuthenticateController::class, 'index'])->name('login.index');
        Route::post('/login', [SellerAuthenticateController::class, 'store'])->name('login.store');
  
    Route::middleware('seller')->group(function () {
        Route::get('/logout', [SellerAuthenticateController::class, 'destroy'])->name('logout.get');
        Route::post('/logout', [SellerAuthenticateController::class, 'destroy'])->name('logout.post');
    });
});

require __DIR__ . '\dashboard.php';
require __DIR__ . '\guest.php';
require __DIR__ . '\profile.php';
require __DIR__ . '\building.php';
require __DIR__ . '\room.php';
require __DIR__ . '\bed.php';
require __DIR__ . '\history.php';
require __DIR__ . '\request.php';
require __DIR__ . '\building_application.php';
