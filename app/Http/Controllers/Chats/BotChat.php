<?php

namespace App\Http\Controllers\Chats;

use App\Http\Controllers\Controller;
use Illuminate\Container\Attributes\Auth;
use Illuminate\Http\Request;

class BotChat extends Controller
{
    public function fetchBotMessages(Request $request){
        $userId = $request->user()->id;

        
    }
}
