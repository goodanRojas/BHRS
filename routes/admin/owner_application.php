<?php

use App\Http\Controllers\Admin\Owner\OwnerApplicationController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin/applications')->name('admin.applications.')->group(function() {
    Route::get('/', [OwnerApplicationController::class, 'index'])->name('index');
    Route::get('/show/{application}', [OwnerApplicationController::class, 'show'])->name('show');

    Route::post('/approve/{application}', [OwnerApplicationController::class, 'approve'])->name('approve');
    Route::post('/reject/{application}', [OwnerApplicationController::class, 'reject'])->name('reject');
});