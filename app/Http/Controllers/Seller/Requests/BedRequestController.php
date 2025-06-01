<?php

namespace App\Http\Controllers\Seller\Requests;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use App\Models\{Booking, Rejection, Payment, BookingCancelled};

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
        Log::info($request->all());

        // Validate the incoming request (recommended)
        $request->validate([
            'receiptImage' => 'required|image|max:2048', // adjust rules as needed
        ]);

        // Handle receipt image upload if present
        if ($request->hasFile('receiptImage')) {
            // Store the file in the 'public/receipts' directory
            $path = $request->file('receiptImage')->store('receipts', 'public');
            $hashedFileName = basename($path); // safer than hashName() here
            $booking->seller_receipt = $hashedFileName;
        } else {
            // Optional: handle case if no file is uploaded
            // You may want to return with error or do something else
            return redirect()->back()->withErrors(['receiptImage' => 'Receipt image is required.']);
        }

        // Update booking status to approved
        $booking->status = 'approved';

        // Save the updated booking record
        $booking->save();

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
