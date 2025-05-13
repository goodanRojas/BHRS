<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\BuildingController;



Route::middleware('auth')->group(function () {
    Route::get('/home/buildings', [BuildingController::class, 'showToUserBuilding'])->name('to.user.buildings');
    Route::get('/home/building/{building}', [BuildingController::class, 'showToUserBuilding'])->name('to.user.building.details');
    Route::get('/home/buildings/search', [BuildingController::class, 'searchBuildings'])->name('to.user.building.details');
    

});
