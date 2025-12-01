<?php 

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Owner\CustomerSupport\CustomerSupportController;
Route::prefix('/seller/customer/support')->name('seller.customer.support.')->middleware('seller')->group(function () {
    Route::get('/', [CustomerSupportController::class, 'index'])->name('index');
    Route::get('/show/{id}', [CustomerSupportController::class, 'show'])->name('show');
    Route::post('/store', [CustomerSupportController::class, 'store'])->name('store');

});