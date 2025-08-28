<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Seller;
use App\Models\BedBooking;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Booking;
use App\Models\Bed;
use App\Models\Room;
use Illuminate\Support\Facades\Log;
class SellerGuestController extends Controller
{
    public function index()
    {
        $seller = Auth::guard('seller')->user();
        $bedBookings = Booking::with(['user' ,'bookable' => function ($morph) {
            $morph->with(['room.building']);
        }])
        ->where('bookable_type', Bed::class)
        ->where('status', 'completed')
        ->whereHas('bookable.room.building', function($q) use ($seller) {
            $q->where('seller_id', $seller->id);
        })
        ->get();

        return Inertia::render('Seller/Guest/Guests',[
            'bookings' => $bedBookings
        ]);
    }
}
