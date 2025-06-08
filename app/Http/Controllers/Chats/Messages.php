<?php

namespace App\Http\Controllers\Chats;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\{Seller, User};
use Illuminate\Support\Facades\Log;

class Messages extends Controller
{

    public function index(Request $request)
    {
        // Query sent messages where sender_type or receiver_type is User::class, excluding Seller::class
        $sentMessages = $request->user()->sentMessages()
            ->where(function ($query) {
                $query->where('sender_type', User::class)
                    ->orWhere('receiver_type', User::class);
            })
            ->where(function ($query) {
                $query->where('sender_type', '!=', Seller::class)
                    ->where('receiver_type', '!=', Seller::class);
            })
            ->get();

        // Query received messages where sender_type or receiver_type is User::class, excluding Seller::class
        $receivedMessages = $request->user()->receivedMessages()
            ->where(function ($query) {
                $query->where('sender_type', User::class)
                    ->orWhere('receiver_type', User::class);
            })
            ->where(function ($query) {
                $query->where('sender_type', '!=', Seller::class)
                    ->where('receiver_type', '!=', Seller::class);
            })
            ->get();

        // Return the data to the Inertia view
        return Inertia::render('Home/Messages/Messages', [
            'sentMessages' => $sentMessages,
            'receivedMessages' => $receivedMessages,
        ]);
    }
}
