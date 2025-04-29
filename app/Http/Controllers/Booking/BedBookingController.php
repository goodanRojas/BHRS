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
    public function index(Bed $bed)
    {
        $bed->load("bookings", "room.building");

        return Inertia::render('Home/Booking/BedBooking',[
            'bed' => $bed,
        ]);
    }

    public function bookBed(Request $request, $bedId)
    {
        // Validate form data
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'start_date' => 'required|date',
            'month_count' => 'required|integer',
            'payment_method' => 'required|in:cash,gcash',
            'total_price' => 'required|numeric',
            'bed_id' => 'required|exists:beds,id',
        ]);
    
        // Create the booking record
        $booking = Booking::create([
            'user_id' => $validated['user_id'],
            'bookable_id' => $validated['bed_id'],
            'bookable_type' => Bed::class, // Assuming you're booking a bed
            'start_date' => $validated['start_date'],
            'end_date' => $this->calculateEndDate($validated['start_date'], $validated['month_count']),
            'total_price' => $validated['total_price'],
            'status' => 'pending',
        ]);
    
        // Handle payment method
        if ($validated['payment_method'] == 'cash') {
            return response()->json([
                'success' => true,
                'message' => 'Booking successful. Please proceed to pay in cash at the boarding house.',
                'booking_id' => $booking->id,
            ]);
        }
    
        // If payment is via GCash, redirect to GCash payment UI
        if ($validated['payment_method'] == 'gcash') {
            // Implement logic for redirecting to GCash payment (this will depend on the GCash API)
            return response()->json([
                'success' => true,
                'gcash_url' => $this->generateGCashPaymentURL($booking), // This will be a placeholder URL
                'message' => 'Please proceed to GCash payment.',
                'booking_id' => $booking->id,
            ]);
        }
    }
    
}
