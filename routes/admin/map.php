<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\Owner\Building\Map;

Route::prefix('admin/owner/buildings/map/destination')->name('admin.owner.buildings.map.destination.')->middleware('admin')->group(function () {
    Route::get('/', [Map::class, 'index'])->name('index');
    Route::post('/store', [Map::class, 'store'])->name('store'); // Assuming you have a store method for handling form submissions
    Route::delete('/delete/{id}', [Map::class, 'destroy'])->name('destroy'); // Assuming you have a destroy method for deleting destinations
    Route::post('/update/{id}', [Map::class, 'update'])->name('update'); // Assuming you have an update method for editing destinations
});