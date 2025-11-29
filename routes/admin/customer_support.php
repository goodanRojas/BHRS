<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\CustomerSupport\CustomerSupportController;

Route::prefix('admin/customer/support')->name('admin.customer.support.')->middleware('admin')->group(function () {
    Route::get('/', [CustomerSupportController::class, 'index'])->name('index');
    Route::get('/show/{id}', [CustomerSupportController::class, 'show'])->name('show');
    Route::patch('/update/{ticket}', [CustomerSupportController::class, 'update'])->name('update');
    Route::post('/reply/{ticket}', [CustomerSupportController::class, 'reply'])->name('reply');
});