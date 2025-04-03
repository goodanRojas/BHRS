<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class RoomController extends Controller
{
    public function show(Room $room)
    {
        // Ensure the authenticated seller owns the building associated with the room
        $sellerId = Auth::guard('seller')->id();

        if ($room->building->seller_id !== $sellerId) {
            abort(403, 'Unauthorized access');
        }

        // Load room and its building details
        $room->load('building', 'beds.user', 'user');

        return Inertia::render('Seller/Rooms', [
            'room' => $room,
        ]);
    }


}
