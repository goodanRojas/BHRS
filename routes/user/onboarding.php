<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\OnboardingController;

Route::prefix('user/onboarding')->name('user.onboarding.')->middleware('auth')->group(function () {
    Route::get('/', [OnboardingController::class, 'show'])->name('show');
    Route::post('/', [ OnboardingController::class, 'store'])->name('store');

    Route::get('/get/preferences', [OnboardingController::class, 'getPrefrences'])->name('get.preferences');
    
});
