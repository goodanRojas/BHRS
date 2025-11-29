<?php

namespace App\Http\Controllers\Booking;

use App\Events\Owner\UserGcashPaid;
use App\Http\Controllers\Controller;
use App\Events\Owner\NewBooking;
use App\Models\{Receipt, Address, Bed, Booking, User, AdminLog};
use App\Notifications\NewBookingNotification;
use App\Notifications\User\UserBookingGcashPaid;
use App\Notifications\Seller\BookingCancelledNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;

class BedBookingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Bed $bed)
    {
        $userId = auth()->id();
        $userHasBooking = Booking::where('user_id', $userId)
            ->where('status', 'completed')->first();

        if ($userHasBooking) {
            return redirect()->back()->with('error', "You're not allowed to book if you have an ongoing booking.");
        }
        $bed->load("bookings.address", "room.building");
        $userPreferences = Booking::where('user_id', auth()->id())
            ->with('address')
            ->latest()
            ->first();


        return Inertia::render('Home/Booking/BedBooking', [
            'bed' => $bed,
            'userPreferences' => $userPreferences,
        ]);
    }

    public function bookBed(Request $request, $bedId)
    {
        $user = auth()->user();
        $request->validate([
            'start_date' => 'required|date',
            'month_count' => 'required|integer|min:1',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'payment_method' => 'required|in:cash,gcash',
            'agreedToTerms' => 'required|accepted',
            'address.barangay' => 'required|string|max:255',
            'address.municipality' => 'required|string|max:255',
            'address.province' => 'required|string|max:255',
            'address.region' => 'required|string|max:100',
        ]);
        $booking = Booking::create([
            'user_id' => auth()->id(),
            'bookable_type' => Bed::class,
            'bookable_id' => $bedId,
            'start_date' => Carbon::parse($request->start_date),
            'month_count' => $request->month_count,
            'total_price' => $request->total_price,
            'status' => 'pending',
            'payment_method' => $request->payment_method,
            'special_request' => $request->special_request,
            'agreed_to_terms' => $request->agreedToTerms,
        ]);
        Address::create([
            'addressable_id' => $booking->id,
            'addressable_type' => Booking::class,
            'address' => $request->address,
        ]);
        AdminLog::create([
            'actor_type' => User::class,
            'actor_id' => $user->id,
            'name' => $user->name,
            'activity' => 'Booked a bed',
        ]);

        $seller = $booking->bookable->room->building->seller;

        $seller->notify(new NewBookingNotification($booking));  // Notify the owner
        event(new NewBooking($booking)); // Broadcast the event to update the ui

        return redirect()->route('accommodations.index')->with('success', 'Booking request created successfully.');
    }



    // Show GCash payment page with React/Inertia
    public function showGCashPaymentPage($booking_id)
    {
        
        $booking = Booking::where('id', $booking_id)
            ->where('user_id', auth()->id())
            ->where('status', 'approved')
            ->with([
                'bookable.room.building.seller.paymentInfo' => function ($query) {
                    $query->select('owner_id', 'gcash_number', 'gcash_name', 'qr_code');
                }
            ])
            ->first();
        if (!$booking) {
            return redirect()->route('accommodations.index')->with('error', 'Booking not found or not authorized.');
        }
        $ammount = $booking->total_price;
        $paymentInfo = $booking->bookable->room->building->seller->paymentInfo;
        return Inertia::render('Home/Booking/GcashPayment', [
            'booking' => $booking,
            'paymentInfo' => $paymentInfo,
            'amount' => $ammount,
        ]);
    }

    public function confirmGcashPayment(Request $request)
    {
        $user = auth()->user();
        $request->validate([
            'booking_id' => 'required|exists:bookings,id',
            'remarks' => 'nullable|string|max:255',
            'ref_number' => 'nullable|string|max:255',
            'payment_proof' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);
        $booking = Booking::where('id', $request->booking_id)->first();
        $booking->status = "paid";
        $booking->save();

        $path = $request->file('payment_proof')->store('receipts', 'public');

        $receipt = Receipt::create([
            'booking_id' => $booking->id,
            'user_receipt' => $path,
            'payment_method' => 'gcash',
            'user_remarks' => $request->remarks,
            'user_ref_number' => $request->ref_number,
            'status' => 'pending',
            'amount' => $booking->total_price,
            'paid_at' => Carbon::now(),
        ]);
        $booking->bookable->room->building->seller->notify(new UserBookingGcashPaid($booking));

        event(new UserGcashPaid($receipt));
        AdminLog::create([
            'actor_type' => User::class,
            'actor_id' => $user->id,
            'name' => $user->name,
            'activity' => 'Confirmed GCash payment for a booking',
        ]);
        return redirect()->route('accommodations.index');
    }

    /* Cancel booking */
    public function cancelBooking(Request $request, Booking $booking)
    {
        $user = auth()->user();
        $booking->status = 'canceled';
        $booking->save();
        // Notify the owner about the cancellation
        $booking->bookable->room->building->seller->notify(new BookingCancelledNotification($booking));

        AdminLog::create([
            'actor_type' => User::class,
            'actor_id' => $user->id,
            'name' => $user->name,
            'activity' => 'Cancelled a booking',
        ]);
        return redirect()->route('accommodations.canceled')->with('success', 'Booking cancelled successfully.');
    }
}
