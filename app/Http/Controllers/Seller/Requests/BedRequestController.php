<?php

namespace App\Http\Controllers\Seller\Requests;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon;
use App\Models\Booking;
use App\Models\Rejection;
use App\Models\Payment;
use App\Events\Request\BookingCancelled;

class BedRequestController extends Controller
{
    public function index($id)
    {
        // Eager load the related models for the booking
        $booking = Booking::where('id', $id)
            ->with(['user', 'payment', 'bookable' => function ($morph) {
                $morph->with(['room.building']);
            }])
            ->firstOrFail();

        // Return the Inertia page with the booking data
        return inertia('Seller/Guest/Request/BedRequest', [
            'booking' => $booking,
        ]);
    }
    public function accept(Request $request, Booking $booking)
    {
        // dd($request);
        // Check if payment method is 'cash'
        if ($booking->payment_method !== 'cash') {
            return back()->with(['error' => 'Only cash payments can be accepted'], 400);
        }

        // Update payment status to 
        $booking->status = 'approved';
        $booking->save();

        $request->file('receiptImage')->store('receipts', 'public');
        $hashedFileName = $request->file('receiptImage')->hashName();
        Payment::create([
            'user_id' => $booking->user_id,
            'booking_id' => $booking->id,
            'amount' => $booking->total_price,
            'payment_method' => 'cash',
            'status' => 'completed',
            'transaction_id' => $request->transactionId,
            'receipt' => $hashedFileName,
            'paid_at' => Carbon::now()
        ]);
    
        return redirect()->route('seller.request.index')->with('success', 'Booking accepted and payment completed.');
    }

    /**
     * Reject the booking.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Models\Booking  $booking
     * @return \Illuminate\Http\RedirectResponse
     */
    public function reject(Request $request)
    {
        // dd($request);
        $request->validate([
            'rejectReason' => 'required|string|max:255', // Adjust the max length as needed
        ]);
        // Mark the booking as rejected

       $booking =  Booking::where('id', $request->bookingId)->update(['status' => 'rejected']);
      
        Rejection::create([
            'rejectable_id' => $request->bookingId,
            'rejectable_type' => Booking::class,
            'reason' => $request->rejectReason,
            'status' => 'rejected',
            'rejected_by' => auth('seller')->id(),
        ]);

        // broadcast(new BookingCancelled($booking, $request->reason))->toOthers();

        return redirect()->route('seller.request.index')->with('success', 'Booking rejected.');
    }
}
