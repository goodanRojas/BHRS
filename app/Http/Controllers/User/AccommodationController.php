<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\BedBooking;
use App\Models\Feedback;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
class AccommodationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $bedId = $request->query('bedId');
        $details = BedBooking::with(['bed.room.building.seller'])
            ->where('user_id', auth()->id())
            ->where('status', 'confirmed')
            ->get();

        return Inertia::render('Home/Accommodation/Dashboard', [
            'details' => $details,
            'bedId' => $bedId
        ]);
    }

    public function showHistory(Request $request)
    {
        $details = BedBooking::with(['bed.room.building.seller'])
            ->where('user_id', auth()->id())
            ->where('status', 'completed')
            ->get();
        return Inertia::render('Home/Accommodation/History', ['details' => $details]);
    }

    public function show(Request $request, $id)
    { 
         $userId = auth()->id();
        $details = BedBooking::with(['bed.room.building.seller'])
            ->where('id', $id)
            ->firstOrFail();
        $count = BedBooking::where('user_id', $userId)->where('status', 'completed')->count();
        return Inertia::render('Home/Accommodation/Bed', ['bed' => $details, 'count' => $count]);
    }


    public function store(Request $request)
    {
        $request->validate([
            'comment' => 'required|string|max:500',
            'rating' => 'required|integer|min:1|max:5',
            'booking_id' => 'required|exists:bed_bookings,id',
        ]);

        Feedback::create(
            [
                'user_id' => Auth::id(),
                'booking_id' => $request->booking_id
            ],
            [
                'comment' => $request->comment,
                'rating' => $request->rating,
            ]
        );

        return back()->with('success', 'Feedback submitted successfully!');
    }

}
