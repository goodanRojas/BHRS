<?php


use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\Owner\Building\Application;

Route::prefix('admin/owner/building/application')->name('admin.owner.building.application.')->middleware('admin')->group(function () {
    Route::get('/', [Application::class, 'index'])->name('index');
    Route::post('/approve', [Application::class, 'store'])->name('store');
    Route::get('/show/{application}', [Application::class, 'show'])->name('show');
});
