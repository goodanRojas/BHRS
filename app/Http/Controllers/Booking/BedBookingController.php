<?php

namespace App\Http\Controllers\Booking;

use App\Http\Controllers\Controller;
use App\Models\Bed;
use App\Models\BedBooking;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BedBookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */ public function create(Request $request, Bed $bed)
    {
        // Ensure the bed and its related room are loaded
        $bed->load('room.building');

        // Return the booking creation form with the bed and room data
        return Inertia::render('Home/BedBooking/Booking', [
            'bed' => $bed
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'bed_id' => 'required|exists:beds,id',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'address' => 'required|string|max:255',
            'start_date' => 'required|date',
            'message' => 'nullable|string',
            'payment_method' => 'required|numeric',
            'total_price' => 'required|numeric|min:0',
            'month_count' => 'required|numeric|min:0',
        ]);
        $validated['user_id'] = auth()->id();


        BedBooking::create($validated);

        return redirect()->back()->with('success', 'Booking created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Bed $bed)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Bed $bed)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Bed $bed)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Bed $bed)
    {
        //
    }
}
