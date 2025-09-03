<?php

use App\Http\Controllers\Chatbot\ChatbotController;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Chats\{DirectChat, GroupChat, LandOwnerController, Messages};

Route::middleware('auth')->group(function () {

    Route::prefix('messages')->name('messages.')->group(function () {
        Route::get('/', [Messages::class, 'index'])->name('index');
        Route::get('/owner', [Messages::class, 'ownerMessages'])->name('owner');
    });

    Route::controller(DirectChat::class)->group(function () {
        Route::get('/direct-message', 'fetchUserMessages');
        Route::get('direct-message/selected-user/{id}', 'fetchUserConversation');
        Route::get('/direct-message/search', 'searchUsers');
        Route::post('/direct-messages/send', 'sendMessage');
        Route::get('/direct-messages/users', 'getUsers');
        Route::delete('/direct-message/delete/{selectedUserId}', 'deleteConversation');
    });


    /* Landowner  */

    Route::controller(LandOwnerController::class)->group(function () {
        Route::get('/owner-message', 'fetchOwnerMessages');
        Route::get('/owner-message/selected-owner/{ownerId}', 'fetchOwnerConversation');
        Route::get('/owner-message/search', 'searchOwners');
        Route::post('/owner-messages/send', 'sendMessage');
        Route::get('/owner-messages/owners', 'getOwners');
        Route::delete('/owner-message/delete/{selectedUserId}', 'deleteConversation');
    });


    /* Group Chat */

    Route::controller(GroupChat::class)->prefix('/group')->group( function (){
        Route::get('/', 'index');
        Route::post('/send-message', 'SendMessage')->name('group.send');
    });

    // Route to display the chat interface
    Route::get('/chatbot/seller/{sellerId}/bed/{bedId}', [ChatbotController::class, 'showChat'])->name('chat.show');

    // Route to send a new message
    Route::post('/chatbot/message', [ChatbotController::class, 'sendMessage'])->name('chat.send');
});
