<?php

use App\Http\Controllers\Admin\OwnerController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->middleware('admin')->group(function() {
    Route::get('/owners', [OwnerController::class, 'index'])->name('owners');
    Route::get('/owners/owners', [OwnerController::class, 'owners'])->name('owners.owners');
    Route::post('/owners/toggle-status/{id}', [OwnerController::class, 'toggleStatus'])->name('owners.toggle-status');
    Route::post('/owner/update/{id}', [OwnerController::class, 'updateOwner'])->name('owner.update');
    Route::post('/owner/create', [OwnerController::class, 'create'])->name('owner.create');
    Route::get('/owner/requests', [OwnerController::class, 'requests'])->name('owners.requests');
});

Route::prefix('admin/owners/requests')->name('admin.owners.requests')->middleware('admin')->group(function() {
    Route::get('/', [OwnerController::class, 'showRequests'])->name('show');
});