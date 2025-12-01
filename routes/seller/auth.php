<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Seller\{SellerAuthenticateController, SellerRegisterController};
use App\Http\Controllers\Seller\Auth\{PasswordResetLinkController, NewPasswordController};
use App\Http\Controllers\Seller\Warning\WarningController;
use Inertia\Inertia;

Route::prefix('seller')->name('seller.')->group(function () {
    Route::middleware('guest:seller')->group(function () {
        Route::get('/login', [SellerAuthenticateController::class, 'create'])->name('login.index');
        Route::post('/login', [SellerAuthenticateController::class, 'store'])->name('login.store');

        Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
            ->name('password.request');

        Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
            ->name('password.email');

        Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
            ->name('password.reset');

        Route::post('reset-password', [NewPasswordController::class, 'store'])
            ->name('password.store');
    });
    Route::middleware('seller')->group(function () {
        Route::get('/current/subscription', [SellerAuthenticateController::class, 'currentSubscription'])->name('current.subscription');
        Route::get('/logout', [SellerAuthenticateController::class, 'destroy'])->name('logout.get');
        Route::post('/logout', [SellerAuthenticateController::class, 'destroy'])->name('logout.post');

        Route::get('/warning/check', [WarningController::class, 'checkWarning'])->name('warning.check');
    });
});



require __DIR__ . '/subscription.php';
require __DIR__ . '/dashboard.php';
require __DIR__ . '/guest.php';
require __DIR__ . '/profile.php';
require __DIR__ . '/building.php';
require __DIR__ . '/room.php';
require __DIR__ . '/bed.php';
require __DIR__ . '/history.php';
require __DIR__ . '/request.php';
require __DIR__ . '/building_application.php';
require __DIR__ . '/message.php';
require __DIR__ . '/payment_details.php';
require __DIR__ . '/notification.php';
require __DIR__ . '/map.php';
require __DIR__ . '/rules.php';
require __DIR__ . '/guest_history.php';
require __DIR__ . '/customer_support.php';