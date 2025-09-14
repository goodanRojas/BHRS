<?php


use App\Http\Controllers\Admin\AdminController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->group(function() {
   Route::middleware('guest:admin')->group(function() {
        Route::get('/login', [AdminController::class, 'index'])->name('login');
        Route::post('/login', [AdminController::class, 'store'])->name('login.store');
    });
        Route::middleware('admin')->group(function(){
            Route::get('/logout', [AdminController::class, 'logout'])->name('logout.get');
        Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
        Route::post('/logout', [AdminController::class, 'logout'])->name('logout.post');
    });
});


require __DIR__.'/user.php';
require __DIR__.'/payment_info.php';
require __DIR__.'/owner.php';
require __DIR__.'/profile.php';
require __DIR__.'/building.php';
require __DIR__.'/route.php';
require __DIR__.'/map.php';
require __DIR__.'/building_application.php';
require __DIR__.'/owner_application.php';
require __DIR__.'/room.php';
require __DIR__.'/bed.php';
require __DIR__.'/subscription.php';
