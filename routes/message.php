<?php

use App\Http\Controllers\Chats\BotChat;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Chats\DirectChat;
use App\Http\Controllers\Chats\GroupChat;

Route::middleware('auth:sanctum')->group(function () {
    Route::controller(DirectChat::class)->group(function () {
        Route::get('/direct-message', 'fetchUserMessages');
        Route::get('/direct-message/search', 'searchUsers');
    });
    Route::controller(GroupChat::class)->group(function () {
        Route::get('/group-message', 'fetchGroupMessages');
    });
    Route::controller(BotChat::class)->group(function () {
        Route::get('/bot-message', 'fetchBotMessages');
    });
});
