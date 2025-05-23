<?php

namespace App\Http\Controllers\Chatbot;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Services\DeepseekService;
class ChatbotController extends Controller
{
    
 
    protected $deepseekService;

    public function __construct(DeepseekService $deepseekService)
    {
        $this->deepseekService = $deepseekService;
    }

    public function getResponse(Request $request)
    {
        $userMessage = $request->input('message');
        $response = $this->deepseekService->getChatbotResponse($userMessage);
        return response()->json(['response' => $response]);
    }
}
