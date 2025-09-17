<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Admin\Building\RulesController;


Route::prefix('admin/building')->middleware(['admin'])->group(function () {
    Route::get('/{id}/{sellerId}/rules', [RulesController::class, 'find']);
    Route::post('/{id}/{sellerId}/rules', [RulesController::class, 'store']); // add a rule
    Route::put('/rules/{rule}', [RulesController::class, 'update']); // edit a rule
    Route::delete('/rules/{rule}', [RulesController::class, 'destroy']); // delete a rule
});