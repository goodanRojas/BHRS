<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\BedBooking;
use App\Models\User;
use App\Notifications\UserNotification;

class SellerGuestRequestController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sellerId = Auth::guard('seller')->id(); // Corrected to direct id() call

        $requests = BedBooking::with(['bed.room.building', 'user'])
            ->where('status', 'awaiting')
            ->whereHas('bed.room.building', function ($query) use ($sellerId) {
                $query->where('seller_id', $sellerId); // Filtering through the `bed` relationship
            })
            ->get();
        return Inertia::render('Seller/Guest/Requests', [
            'requests' => $requests
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create() {}

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request,)
    {
        $id = $request->id;
        $request = BedBooking::with(['bed.room.building', 'user'])
            ->where('id', '=', $id)
            ->firstOrFail();
        return Inertia::render('Seller/Guest/Request', [
            'request' => $request
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $request = BedBooking::findOrFail($id);
        $request->status = 'confirmed';
        $request->save();
        $user_id = $request->user_id;
        $user = User::findOrFail($user_id);
        $user->notify(new UserNotification([
            'title' => 'Booking confirmed',
            'message' => 'Your booking has been confirmed',
            'id' => $request->id
        ]));

        return response()->json(['message' => 'Request confirmed']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
