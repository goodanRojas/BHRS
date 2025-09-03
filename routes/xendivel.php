<?php

use App\Http\Controllers\Payment\XenditPaymentController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
// Redirect route after user completes payment
Route::get('/payment/success', [XenditPaymentController::class, 'paymentSuccess'])->name('payment.success');

// Callback route Xendit uses to update status
Route::post('/xendit/callback', [XenditPaymentController::class, 'handleCallback'])->name('xendit.callback');


Route::get('/xendivel/checkout', function () {
    return Inertia::render('xendivel/Checkout');
})->name(name: 'xendivel.checkout');