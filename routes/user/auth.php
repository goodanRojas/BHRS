<?php

use App\Http\Controllers\Auth\AuthenticatedSessionController;
use App\Http\Controllers\Auth\ConfirmablePasswordController;
use App\Http\Controllers\Auth\EmailVerificationNotificationController;
use App\Http\Controllers\Auth\EmailVerificationPromptController;
use App\Http\Controllers\Auth\NewPasswordController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\Auth\PasswordResetLinkController;
use App\Http\Controllers\Auth\RegisteredUserController;
use App\Http\Controllers\Auth\VerifyEmailController;
use App\Http\Controllers\Auth\AddressController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Seller\SellerRegisterController;

Route::middleware('guest')->group(function () {
    Route::get('register', [RegisteredUserController::class, 'create'])
        ->name('register');

    Route::post('register', [RegisteredUserController::class, 'store']);

    Route::get('login', [AuthenticatedSessionController::class, 'create'])
        ->name('login');

    Route::post('login', [AuthenticatedSessionController::class, 'store'])->name('login.store');

    Route::get('forgot-password', [PasswordResetLinkController::class, 'create'])
        ->name('password.request');

    Route::post('forgot-password', [PasswordResetLinkController::class, 'store'])
        ->name('password.email');

    Route::get('reset-password/{token}', [NewPasswordController::class, 'create'])
        ->name('password.reset');

    Route::post('reset-password', [NewPasswordController::class, 'store'])
        ->name('password.store');
});

Route::middleware('auth')->group(function () {
    Route::get('verify-email', EmailVerificationPromptController::class)
        ->name('verification.notice');

    Route::get('verify-email/{id}/{hash}', VerifyEmailController::class)
        ->middleware(['signed', 'throttle:6,1'])
        ->name('verification.verify');

    Route::post('email/verification-notification', [EmailVerificationNotificationController::class, 'store'])
        ->middleware('throttle:6,1')
        ->name('verification.send');

    Route::get('confirm-password', [ConfirmablePasswordController::class, 'show'])
        ->name('password.confirm');

    Route::post('confirm-password', [ConfirmablePasswordController::class, 'store']);

    Route::put('password', [PasswordController::class, 'update'])->name('password.update');

    Route::post('logout', [AuthenticatedSessionController::class, 'destroy'])
        ->name('logout');

    Route::put('profile/address/update', [AddressController::class, 'update'])->name('profile.address.update');


    Route::put("/seller/register/{id}/cancel", [SellerRegisterController::class, 'cancel'])->name('seller.register.cancel');
    Route::get("/seller/register", [SellerRegisterController::class, 'index'])->name('seller.register.index');
    Route::post("seller/register", [SellerRegisterController::class, 'store'])->name('seller.register.store');
    Route::get("/seller/register/show", [SellerRegisterController::class, 'show'])->name('seller.register.show');
    Route::get("/seller/register/approved", [SellerRegisterController::class, 'approved'])->name('seller.register.approved');
    Route::get("/seller/register/{application}/show/approved", [SellerRegisterController::class, 'showApproved'])->name('seller.register.show.approved');
});




require __DIR__ . '/accommodation.php';
require __DIR__ . '/booking.php';
require __DIR__ . '/building.php';
require __DIR__ . '/favorite.php';
require __DIR__ . '/map.php';
require __DIR__ . '/message.php';
require __DIR__ . '/notification.php';
require __DIR__ . '/room.php';
require __DIR__ . '/profile.php';
require __DIR__ . '/onboarding.php';
require __DIR__ . '/feedback.php';
require __DIR__ . '/bed.php';