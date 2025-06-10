<?php

namespace App\Http\Controllers\Seller\Message;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth, Log};
use Inertia\Inertia;
use App\Models\{Message, Seller, User};

class MessageController extends Controller
{
    public function index(Request $request)
    {
        $sellerId = Auth::guard('seller')->id();
        $messages = Message::where('sender_id', $sellerId)
            ->orWhere('receiver_id', $sellerId)
            ->where('sender_type', Seller::class)
            ->orWhere('receiver_type', Seller::class)
            ->orderBy('created_at', 'asc')
            ->get();
        $users = User::whereIn('id', $messages->pluck('sender_id')->merge($messages->pluck('receiver_id')))
            ->get()
            ->keyBy('id'); 
        return Inertia::render('Seller/Message/Index', [
            'messages' => $messages,
            'users' => $users,
        ]);
    }
}
