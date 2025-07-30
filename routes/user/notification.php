<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\NotificationController;
Route::middleware('auth')->name('notifications.')->prefix('/notifications')->group(function (): void {
    Route::get('/', [NotificationController::class, 'index'])->name('index');
    Route::get('/latest', [NotificationController::class, 'latest'])->name('latest');
});