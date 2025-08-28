<?php

use App\Http\Controllers\User\FeedbackController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->prefix('/feedback')->name('feedback.')->group(function () {
    Route::get('/bookings/{booking}', [FeedbackController::class, 'show'])->name('bookings.show');
    Route::post('/bookings/{booking}/rate', [FeedbackController::class, 'rate'])->name('bookings.rate');
    Route::post('/bookings/{booking}/comments', [FeedbackController::class, 'comment'])->name('bookings.comment');
    Route::put('/bookings/{comment}/comments/edit', [FeedbackController::class, 'editComment'])->name('bookings.comment.edit');
    Route::delete('/bookings/{comment}/comments/delete', [FeedbackController::class, 'destroy'])->name('bookings.comment.delete');
});
