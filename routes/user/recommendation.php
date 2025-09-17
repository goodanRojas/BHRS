<?php 

use App\Http\Controllers\User\RecommendationController;
use Illuminate\Support\Facades\Route;

Route::prefix('user/recommendation')->name('user.recommendation.')->middleware('auth')->group(function () {
    Route::get('/get/user/preferred/buildings', [RecommendationController::class, 'getUserPreferredBuildings'])->name('get.user.preferred.buildings');
});