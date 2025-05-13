<?php


use App\Http\Controllers\Admin\AdminController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->group(function() {
    Route::get('/login', [AdminController::class, 'index'])->name('login.index');
    Route::post('/login', [AdminController::class, 'store'])->name('login.store');
    Route::middleware('admin')->group(function(){
        Route::get('/logout', [AdminController::class, 'logout'])->name('logout');
        Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');
        Route::post('/logout', [AdminController::class, 'logout'])->name('logout');
    });
});


require __DIR__.'\user.php';
require __DIR__.'\owner.php';
require __DIR__.'\profile.php';