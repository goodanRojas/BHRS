<?php 

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\CustomerSupport\CustomerSupportController;
Route::prefix('/customer/support')->name('customer.support.')->middleware('auth')->group(function () {
    Route::get('/', [CustomerSupportController::class, 'index'])->name('index');
    Route::get('/show/{id}', [CustomerSupportController::class, 'show'])->name('show');
    Route::post('/store', [CustomerSupportController::class, 'store'])->name('store');

});