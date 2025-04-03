<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\AccommodationController;

Route::middleware('auth')->group(function (): void {
    Route::get('/accommodations', [AccommodationController::class, 'index'])->name('accommodations.index');
    Route::get('/accommodations/history', [AccommodationController::class, 'showHistory'])->name('accommodations.history');
    Route::get('/accommodations/{bed}', [AccommodationController::class, 'show'])->name('accommodations.show');
    Route::post('/accommodations/bed/feedback', [AccommodationController::class, 'storeFeedback'])->name('accommodations.feedback');
});
