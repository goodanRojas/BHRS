<?php 

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Seller\SellerDashboardController;
use App\Http\Controllers\Seller\SellerAuthenticateController;


Route::prefix('seller')->name('seller.')->group(function() {
    Route::get('/login', [SellerAuthenticateController::class, 'index'])->name('login.index');
    Route::post('/login', [SellerAuthenticateController::class, 'store'])->name('login.store');
    Route::middleware('admin')->group(function(){
        Route::get('/logout', [SellerAuthenticateController::class, 'logout'])->name('logout');
        Route::post('/logout', [SellerAuthenticateController::class, 'logout'])->name('logout');
    });
});

require __DIR__.'\dashboard.php';
require __DIR__.'\guest.php';
require __DIR__.'\profile.php';
require __DIR__.'\building.php';
require __DIR__.'\room.php';
require __DIR__.'\bed.php';
require __DIR__.'\history.php';
require __DIR__.'\request.php';