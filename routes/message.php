<?php

use App\Http\Controllers\Chats\BotChat;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Chats\DirectChat;
use App\Http\Controllers\Chats\GroupChat;

Route::middleware('auth:sanctum')->group(function () {
    Route::controller(DirectChat::class)->group(function () {
        Route::get('/direct-message', 'fetchUserMessages');
        Route::get('direct-message/selected-user/{id}', 'fetchUserConversation');
        Route::get('/direct-message/search', 'searchUsers');
        Route::post('/direct-messages/send', 'sendMessage');
    });
    Route::controller(GroupChat::class)->group(function () {
        Route::get('/group-message', 'fetchGroupMessages');
        Route::get('/group-message/selected-gc/{groupId}', 'fetchGroupConversation');
        Route::post('/group-messages/send', 'sendMessage');
        Route::post('/group-message/create',  'createGroup');
        Route::put('/group-message/update/{groupId}',  'updateGroup');
        Route::delete('/group-message/delete/{groupId}','deleteGroup');
        Route::post('/group-message/{groupId}/add-member', 'addMemberToGroup');
        Route::delete('/group-message/{groupId}/remove-member', 'removeMemberFromGroup');
    });
    Route::controller(BotChat::class)->group(function () {
        Route::get('/bot-message', 'fetchBotMessages');
    });
});
