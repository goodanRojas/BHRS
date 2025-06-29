<?php

use App\Http\Controllers\Chatbot\ChatbotController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Chats\{DirectChat, GroupChat, Messages};

Route::middleware('auth')->group(function () {

    Route::prefix('messages')->name('messages.')->group(function () {
        Route::get('/', [Messages::class, 'index'])->name('index');
    });

    Route::controller(DirectChat::class)->group(function () {
        Route::get('/direct-message', 'fetchUserMessages');
        Route::get('direct-message/selected-user/{id}', 'fetchUserConversation');
        Route::get('/direct-message/search', 'searchUsers');
        Route::post('/direct-messages/send', 'sendMessage');
        Route::get('/direct-messages/users', 'getUsers');
    });
    Route::controller(GroupChat::class)->group(function () {
        Route::get('/group-message', 'fetchGroupMessages');
        Route::get('/group-message/selected-gc/{groupId}', 'fetchGroupConversation');
        Route::post('/group-messages/send', 'sendMessage');
        Route::post('/group-message/create',  'createGroup');
        Route::put('/group-message/update/{groupId}',  'updateGroup');
        Route::delete('/group-message/delete/{groupId}', 'deleteGroup');
        Route::post('/group-message/{groupId}/add-member', 'addMemberToGroup');
        Route::delete('/group-message/{groupId}/remove-member', 'removeMemberFromGroup');
    });
    // Route to display the chat interface
    Route::get('/chatbot/seller/{sellerId}/bed/{bedId}', [ChatbotController::class, 'showChat'])->name('chat.show');

    // Route to send a new message
    Route::post('/chatbot/message', [ChatbotController::class, 'sendMessage'])->name('chat.send');
});
