<?php

namespace App\Http\Controllers\Seller\Guest;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\{Booking, Bed};
use Inertia\Inertia;
class GuestHistoryController extends Controller
{
    public function index()
    {
        $seller = auth('seller')->user();
        $bookings = Booking::with('user')->where('status', 'ended')
            ->whereHasMorph('bookable', [Bed::class], function ($query) use ($seller) {
                $query->whereHas('room.building', function ($q) use ($seller) {
                    $q->where('seller_id', $seller->id);
                });
            })
            ->paginate(10);

        return Inertia::render(
            'Seller/Guest/Histories',
            [
                'bookings' => $bookings
            ]
        );
    }

    public function show($id)
    {
        $booking = Booking::with('user')->findOrFail($id);
        return Inertia::render(
            'Seller/Guest/History',
            [
                'booking' => $booking
            ]
        );
    }
}
