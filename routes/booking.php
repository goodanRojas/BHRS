<?php

use App\Http\Controllers\Booking\BedBookingController;
use Illuminate\Support\Facades\Route;

Route::middleware('auth')->group(function () {
    Route::get('/beds/{bed}/book', [BedBookingController::class, 'create'])->name('beds.book');
    Route::post('/bed/{bed}/book', [BedBookingController::class, 'store']);
});