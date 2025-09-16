<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Seller\Building\RulesController;

Route::prefix('seller/building')->middleware(['seller', 'check.has.subscription:bronze,silver,gold'])->group(function () {
    Route::get('/{id}/rules', [RulesController::class, 'find']);
    Route::post('/{id}/rules', [RulesController::class, 'store']); // add a rule
    Route::put('/rules/{rule}', [RulesController::class, 'update']); // edit a rule
    Route::delete('/rules/{rule}', [RulesController::class, 'destroy']); // delete a rule
});