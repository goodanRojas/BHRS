<?php


use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\Auth\AuthenticatedSessionController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->group(function () {
    Route::middleware('guest:admin')->group(function () {
        Route::get('/login', [AuthenticatedSessionController::class, 'create'])->name('login');
        Route::post('/login', [AuthenticatedSessionController::class, 'store'])->name('login.store');
    });
    Route::middleware('admin')->group(function () {
        Route::post('/logout', [AuthenticatedSessionController::class, 'logout'])->name('logout.post');
        Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
    });
});


require __DIR__ . '/user.php';
require __DIR__ . '/payment_info.php';
require __DIR__ . '/owner.php';
require __DIR__ . '/profile.php';
require __DIR__ . '/building.php';
require __DIR__ . '/route.php';
require __DIR__ . '/map.php';
require __DIR__ . '/building_application.php';
require __DIR__ . '/owner_application.php';
require __DIR__ . '/room.php';
require __DIR__ . '/bed.php';
require __DIR__ . '/subscription.php';
