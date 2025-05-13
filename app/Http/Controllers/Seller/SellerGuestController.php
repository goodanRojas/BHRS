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
        // Log::info(Auth::guard('seller')->user());
        $seller = Auth::guard('seller')->user();
        $buildingIds = $seller->buildings->pluck('id');
        $roomIds = Room::whereIn('building_id', $buildingIds)->pluck('id');
        $bedIds = Bed::whereIn('room_id', $roomIds)->pluck('id');

        $bedBookings = Booking::with(['user','payment' ,'bookable' => function ($morph) {
            $morph->with(['room.building']);
        }])
        ->where('bookable_type', Bed::class)
        ->whereIn('bookable_id', $bedIds)
        ->where('status', 'approved')
        ->get();

        $roomBookings = Booking::with(relations: ['user', 'payment' ,'bookable' => function ($morph){
            $morph->with('building');
        }])
        ->where('bookable_type', Room::class)   
        ->whereIn('bookable_id', $roomIds)
        ->where('status', 'approved')
        ->get();
        return Inertia::render('Seller/Guest/Guests',[
            'bedBookings' => $bedBookings,
            'roomBookings' => $roomBookings,
        ]);
    }
}
