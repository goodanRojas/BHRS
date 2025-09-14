<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\Payment\PaymentInfoController;

Route::prefix('admin/payment/info')->name('admin.payment.info.')->middleware('admin')->group(function () {
    Route::get('/', [PaymentInfoController::class, 'index'])->name('index');
});