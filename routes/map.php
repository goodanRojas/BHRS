<?php 

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\MapController;
use App\Models\BoardingHouse;

Route::middleware('auth')->group(function () {
    Route::get('/map', [MapController::class, 'index'])->name('map.index');
});