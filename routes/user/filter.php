<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\User\FilterController;

Route::prefix('/user/filter')->name('user.filter.')->middleware('auth')->group(function () {
    Route::post('/', [FilterController::class, 'applyFilter'])->name('apply');
});