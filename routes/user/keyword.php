<?php
use App\Http\Controllers\User\KeywordController;
use Illuminate\Support\Facades\Route;

Route::prefix('user/keyword')->name('user.keyword.')->middleware('auth')->group(function () {
    Route::get('/get-user-preferences', [KeywordController::class, 'getUserPreferences'])->name('get.user.preferences');
});