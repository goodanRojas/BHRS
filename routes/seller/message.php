<?php

use App\Http\Controllers\Chatbot\ChatbotController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Seller\Message\{MessageController};

Route::middleware('seller')->group(function () {

    Route::prefix('/seller/messages')->name('seller.messages.')->group(function () {
        Route::get('/', [MessageController::class, 'index'])->name('index');
    });
});
