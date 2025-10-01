<?php
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\BuildingController;



Route::middleware('auth')->group(function () {
    Route::get('/home/buildings', [BuildingController::class, 'showBuildings'])->name('to.user.buildings');
    Route::get('/home/building/{building}', [BuildingController::class, 'showBuilding'])->name('to.user.building.details');
    Route::get('/home/buildings/search', [BuildingController::class, 'searchBuildings'])->name('to.user.search.building');
    Route::get('/home/buildings/suggestions', [BuildingController::class, 'suggestions'])->name('to.user.building.suggestions');

});
