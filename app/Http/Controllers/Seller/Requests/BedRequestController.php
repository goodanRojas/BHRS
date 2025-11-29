<?php

namespace App\Http\Controllers\Seller\Requests;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Illuminate\Support\Facades\{Log, Auth};
use Inertia\Inertia;
use App\Models\{Booking, Rejection, Receipt, Bed, Seller, AdminLog};
use App\Events\User\Booking\BookingApproved;
use App\Notifications\User\{BookingApprovedNotif, UserBookingRejected};
use App\Events\User\Booking\BookingRejected;
class BedRequestController extends Controller
{
    public function index()
    {
        $seller = Auth::guard('seller')->user();
        ;

        // dd($bedIds);
        $bedRequests = Booking::with([
            'user',
            'bookable' => function ($morph) {
                $morph->with(['room.building']);
            }
        ])
            ->where('bookable_type', Bed::class)
            ->Where('status', 'pending')
            ->whereHas('bookable.room.building', function ($query) use ($seller) {
                $query->where('seller_id', $seller->id);
            })
            ->orderBy('created_at', 'desc')
            ->get();


        return Inertia::render('Seller/Guest/Request/BedRequests', [
            'Requests' => $bedRequests,
        ]);
    }

    public function show($id)
    {
        // Eager load the related models for the booking
        $booking = Booking::where('id', $id)
            ->where('status', 'pending')
            ->with([
                'user',
                'receipt',
                'bookable' => function ($morph) {
                    $morph->with(['room.building']);
                }
            ])
            ->first();


        if ($booking->status === 'approved' || $booking->status === 'rejected' || $booking->status === 'cancelled') {
            return redirect()->route('seller.request.index')->with('error', 'This booking has already been processed.');
        }
        ;


        // Return the Inertia page with the booking data
        return inertia('Seller/Guest/Request/BedRequest', [
            'booking' => $booking,
        ]);
    }
    public function accept(Request $request, Booking $booking)
    {
        $seller = Auth::guard('seller')->user();
        $booking->status = 'approved';
        $booking->save();
        $booking->user->notify(new BookingApprovedNotif($booking));  // Notify the user
        AdminLog::create([
            'actor_type' => Seller::class,
            'actor_id' => $seller->id,
            'name' => $seller->name,
            'activity' => 'Bed Request Accepted',
        ]);
        event(new BookingApproved($booking));
        return redirect()->route('seller.request.bed.index')->with('success', 'Booking accepted and payment completed.');
    }

    public function acceptCash(Request $request)
    {
        $seller = Auth::guard('seller')->user();
        $request->validate([
            'booking_id' => 'exists:bookings,id',
            'receipt' => 'nullable|image|mimes:jpg,jpeg,png,pdf|max:2048',
            'remarks' => 'nullable',
            'amount' => 'required|numeric',
        ]);
        $booking = Booking::find($request->booking_id);
        $booking->status = 'completed';
        $booking->save();
        $booking->user->notify(new BookingApprovedNotif($booking));  // Notify the user
        event(new BookingApproved($booking));


        if ($request->hasFile('receipt')) {
            $path = $request->file('receipt')->store('receipts', 'public');
        }
        $receipt = Receipt::create([
            'booking_id' => $booking->id,
            'seller_receipt' => $path,
            'owner_remarks' => $request->remarks,
            'payment_method' => 'cash',
            'amount' => $request->amount
        ]);

        AdminLog::create([
            'actor_type' => Seller::class,
            'actor_id' => $seller->id,
            'name' => $seller->name,
            'activity' => 'Payment Accepted',
        ]);
        return redirect()->route('seller.request.payments.show', $receipt->id)
            ->with('success', 'Cash payment recorded successfully.');
    }



    public function reject(Request $request)
    {
        $seller = Auth::guard('seller')->user();
        $request->validate([
            'reason' => 'required|string|max:255', // Adjust the max length as needed
        ]);
        // Mark the booking as rejected

        $booking = Booking::find($request->booking_id);
        $booking->status = 'rejected';
        $booking->save();

        Rejection::create([
            'rejectable_id' => $request->booking_id,
            'rejectable_type' => Booking::class,
            'reason' => $request->reason,
            'status' => 'rejected',
            'rejected_by' => auth('seller')->id(),
        ]);
        AdminLog::create([
            'actor_type' => Seller::class,
            'actor_id' => $seller->id,
            'name' => $seller->name,
            'activity' => 'Bed Request Rejected',
        ]);
        event(new BookingRejected($booking, $request->reason));
        $booking->user->notify(new UserBookingRejected($booking, $request->reason));  // Notify the user
        // broadcast(new BookingCancelled($booking, $request->reason))->toOthers();

        return redirect()->route('seller.request.bed.index')->with('success', 'Booking rejected.');
    }
}
