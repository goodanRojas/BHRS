<?php

use App\Http\Controllers\Booking\BedBookingController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/bed/book/{bed}', [BedBookingController::class, 'index']);
    Route::post('/bed/book/{bed}', [BedBookingController::class, 'bookBed'])->name('bed.book');

    Route::get('/bed/book/initiate/gcash/{booking_id}/', [BedBookingController::class, 'showGcashPaymentPage'])->name('gcash.payment.page');
    Route::post('/bed/book/gcash/confirm', [BedBookingController::class, 'confirmGcashPayment'])->name('gcash.payment.confirm');

    Route::post('/bed/book/cancel/{booking}', [BedBookingController::class, 'cancelBooking'])->name('booking.cancel');
});
