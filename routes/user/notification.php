<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\NotificationController;

Route::middleware('auth')->name('notifications.')->prefix('/notifications')->group(function (): void {
    Route::get('/', [NotificationController::class, 'index'])->name('index');
    Route::get('/latest', [NotificationController::class, 'latest'])->name('latest');
    Route::get('/count', [NotificationController::class, 'count'])->name('count');
    Route::post('/mark-all-read', [NotificationController::class, 'markAllRead'])->name('markAllRead');
    Route::post('/{id}/mark-read', [NotificationController::class, 'markAsRead'])->name('markAsRead');
    Route::delete('/destroy-all/{type}', [NotificationController::class, 'destroyAll'])->name('destroyAll');
    Route::delete('/{id}', [NotificationController::class, 'destroy'])->name('destroy');
});
