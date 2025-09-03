<?php

namespace App\Http\Controllers\Chats;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\{Seller, User, Message};
use Illuminate\Support\Facades\{Log, DB};

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
    public function ownerMessages(Request $request)
    {
        $userId = $request->user()->id;
        $sentMessages = Message::where('sender_id', $userId)
            ->where('sender_type', User::class)
            ->where('receiver_type', Seller::class)
            ->get();

        // Query received messages where sender_type or receiver_type is User::class, excluding Seller::class
        $receivedMessages = Message::where('receiver_id', $userId)
            ->where('receiver_type', User::class)
            ->where('sender_type', Seller::class)
            ->get();

        return Inertia::render('Home/Messages/LandOwner', [
            'sentMessages' => $sentMessages,
            'receivedMessages' => $receivedMessages,
        ]);
    }
}
