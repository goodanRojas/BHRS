<?php

use App\Http\Controllers\Admin\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin/users')->name('admin.users.')->middleware('admin')->group(function() {
    Route::get('/', [UserController::class, 'index'])->name('index');
    Route::post('/create', [UserController::class, 'create'])->name('create');
    Route::post('/update/{id}', [UserController::class, 'update'])->name('update');
    Route::post('/toggle-status/{id}', [UserController::class, 'toggleStatus'])->name('toggle.status');
});