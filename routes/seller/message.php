<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Seller\Message\{MessageController};

Route::middleware(['seller', 'check.has.subscription:bronze,silver,gold'])->group(function () {

    Route::prefix('/seller')->controller(MessageController::class)->group(function () {
        Route::get('/messages', 'ownerMessages');
        Route::get('/owner-message', 'fetchOwnerMessages');
        Route::get('/owner-message/selected-owner/{userId}', 'fetchUserConv');
        Route::get('/owner-message/search', 'searchUsers');
        Route::post('/owner-messages/send', 'sendMessage');
        Route::middleware('check.has.subscription')->group(function () {
            Route::post('/owner-message/toggle-ai', 'toggleAI');
        });
        Route::get('/owner-messages/owners', 'getUsers');
        Route::delete('/owner-message/delete/{selectedUserId}', 'deleteConversation');
    });
});
