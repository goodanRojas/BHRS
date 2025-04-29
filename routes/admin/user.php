<?php

use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->middleware('admin')->group(function() {
    Route::get('/users', [UserController::class, 'index'])->name('users');
});