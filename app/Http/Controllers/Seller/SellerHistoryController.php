<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\{Booking, Bed};
use Inertia\Inertia;
class SellerHistoryController extends Controller
{
    public function index()
    {
        $owner = auth()->guard('seller')->user();
        $bookings = Booking::with(['user', 'bookable' => function ($morph) {
            $morph->with(['room.building']);
        }])
            ->where('bookable_type', Bed::class)
            ->where('status', 'ended')
            ->whereHas('bookable.room.building', function ($q) use ($owner) {
                $q->where('seller_id', $owner->id);
            })
            ->get();
        return Inertia::render('Seller/History/Histories', [
            'Bookings' => $bookings
        ]);
    }
}
