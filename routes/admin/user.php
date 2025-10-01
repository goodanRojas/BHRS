<?php

use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin/users')->name('admin.users.')->middleware('admin')->group(function() {
    Route::get('/', [UserController::class, 'index'])->name('index');
    Route::post('/create', [UserController::class, 'create'])->name('create');
    Route::post('/update/{id}', [UserController::class, 'update'])->name('update');
    Route::post('/toggle-status/{id}', [UserController::class, 'toggleStatus'])->name('toggle.status');

    Route::get('/show/{id}', [UserController::class, 'show'])->name('show');

    Route::get('/buildings', [UserController::class, 'buildings'])->name('buildings');

    Route::get('/{userId}/{bedId}/bookings', [UserController::class, 'bookings'])->name('bookings');
    Route::post('/add/booking', [UserController::class, 'addBooking'])->name('add.booking');
});