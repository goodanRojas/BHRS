<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\AccommodationController;

Route::middleware(['auth', 'verified'])->prefix('/accommodations')->group(function (): void {
    Route::get('/', [AccommodationController::class, 'index'])->name('accommodations.index');
    Route::get('/history', [AccommodationController::class, 'showHistory'])->name('accommodations.history');
    Route::post('/bed/feedback', [AccommodationController::class, 'storeFeedback'])->name('accommodations.feedback');
    
    Route::get('/cancelled', [AccommodationController::class, 'showCancelled'])->name('accommodations.cancelled');
    Route::get('/{bed}', [AccommodationController::class, 'show'])->name('accommodations.show');
    Route::post('/{type}/{id}/feedback', [AccommodationController::class, 'storeFeedback'])->name('accommodation.storeFeedback');
});
