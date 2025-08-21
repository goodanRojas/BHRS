<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\Owner\Building\RouteController;

Route::prefix('/admin/route')->name('admin.route.')->middleware('admin')->group(function () {
    Route::get('/building/{building}/route-map', [RouteController::class, 'index']);
    Route::post('/store', [RouteController::class, 'saveRoute'])->name('store');
    Route::delete('/delete/{route}', [RouteController::class, 'destroy'])->name('destroy');
});
