<?php

use App\Http\Controllers\Booking\BedBookingController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('/bed/book/{bed}', [BedBookingController::class, 'index']);
    Route::post('/bed/book/{bed}', [BedBookingController::class, 'bookBed'])->name('bed.book');
    Route::get('/bed/book/initiate/gcash/{bedId}/{amount}', [BedBookingController::class, 'showGCashPaymentPage'])
        ->name('bed.book.initiate.gcash');
    Route::post('/bed/book/confirm/gcash', [BedBookingController::class, 'initiateGCashBooking'])->name('bed.book.confirm.gcash');
});
