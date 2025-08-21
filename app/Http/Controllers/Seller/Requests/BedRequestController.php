<?php

namespace App\Http\Controllers\Seller\Requests;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
use App\Models\{Booking, Rejection, Receipt, BookingCancelled};

class BedRequestController extends Controller
{
    public function index($id)
    {
        // Eager load the related models for the booking
        $booking = Booking::where('id', $id)
            ->where('status' ,'pending')
            ->with(['user', 'receipt', 'bookable' => function ($morph) {
                $morph->with(['room.building']);
            }])
            ->first();
        

        if($booking->status === 'approved' || $booking->status === 'rejected' || $booking->status === 'cancelled') {
            return redirect()->route('seller.request.index')->with('error', 'This booking has already been processed.');
        };
        

        // Return the Inertia page with the booking data
        return inertia('Seller/Guest/Request/BedRequest', [
            'booking' => $booking,
        ]);
    }
    public function accept(Request $request, Booking $booking)
    {

        $booking->status = 'approved';
        $booking->save();
        

        return redirect()->route('seller.request.index')->with('success', 'Booking accepted and payment completed.');
    }



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
