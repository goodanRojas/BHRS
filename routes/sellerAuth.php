<?Php

use App\Http\Controllers\Seller\SellerAuthenticateController;
use App\Http\Controllers\Seller\SellerDashboardController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;



Route::get('/seller-login', function(){
    return Inertia::render('Seller/Login');
})->name('seller.login');

Route::post('/seller-login', [SellerAuthenticateController::class, 'store']);

Route::middleware('seller')->group(function () {
    Route::get('/seller/dashboard', [SellerDashboardController::class, 'index'])->name('seller.dashboard');
    Route::post('/seller/logout', [SellerAuthenticateController::class, 'destroy'])->name('seller.logout');
});