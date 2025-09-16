<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\Payment\PaymentInfoController;

Route::prefix('admin/payment/info')->name('admin.payment.info.')->middleware('admin')->group(function () {
    Route::get('/', [PaymentInfoController::class, 'index'])->name('index');
    Route::post('/store', [PaymentInfoController::class, 'store'])->name('store');
    Route::post('/update/{payment_info}', [PaymentInfoController::class, 'update'])->name('update');
});