<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\Logs\LogsController;
Route::prefix('admin/logs')->name('admin.logs.')->middleware('admin')->group(function () {
    Route::get('/', [LogsController::class, 'index'])->name('index');
});