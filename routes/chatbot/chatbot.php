<?php

use App\Services\OpenAIService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Chatbot\ChatbotController;
use Inertia\Inertia;

Route::post('/chatbot', [ChatbotController::class, 'getResponse']);

Route::get('/chatbot', function () {
    return Inertia::render('Chatbot');
});
