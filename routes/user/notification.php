<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\NotificationController;
Route::middleware('auth')->group(function (): void {
    Route::get('/notification', [NotificationController::class, 'index'])->name('notification.index');
    Route::get('/notification/mark-as-read/{bed}/{notification}', [NotificationController::class, 'markAsRead'])->name('notification.mark-as-read');
});