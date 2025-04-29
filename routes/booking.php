<?php

use App\Http\Controllers\Booking\BedBookingController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('/bed/book/{bed}', [BedBookingController::class, 'index']);
    Route::post('/bed/book/{bed}', [BedBookingController::class, 'proceedBooking'])->name('bed.book');

});