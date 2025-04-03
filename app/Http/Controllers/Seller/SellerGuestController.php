<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Seller;
use App\Models\BedBooking;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;


class SellerGuestController extends Controller
{
    public function show()
    {
        $sellerId = Auth::guard('seller')->id(); // Corrected to direct id() call

        $guests = BedBooking::with(['bed.room.building', 'user'])
            ->where('status', 'confirmed')
            ->whereHas('bed.room.building', function ($query) use ($sellerId) {
                $query->where('seller_id', $sellerId); // Filtering through the `bed` relationship
            })
            ->get();
        return Inertia::render('Seller/Guest/Dashboard', [
            'guests' => $guests
        ]);
    
    }
}
