<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\Owner\Building\BedController;

Route::prefix('/admin/owner/building/bed')->name('admin.owner.building.bed.')->middleware('admin')->group(function () {
    Route::post('/add-feature', [BedController::class, 'addBedFeature'])->name('add.bed.feature');
    Route::post('/add-bed', [BedController::class, 'addBed'])->name('add.bed');
    Route::get('/show-bed/{id}', [BedController::class, 'showBed'])->name('show.bed');
});
