<?php

namespace App\Http\Controllers\Booking;

use App\Http\Controllers\Controller;
use App\Events\NewBookingCreated;
use App\Http\Controllers\Admin\OwnerController;
use App\Models\{OwnerPaymentInfo, Receipt, Address, Bed, Booking};
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
        $bed->load("bookings.address", "room.building");
        $userPreferences = Booking::where('user_id', auth()->id())
            ->with('address', 'payment')
            ->latest()
            ->first();

        return Inertia::render('Home/Booking/BedBooking', [
            'bed' => $bed,
            'userPreferences' => $userPreferences,
        ]);
    }

    // Booking with cash payment
    public function bookBed(Request $request, $bedId)
    {
        Log::info('Booking request data: ', $request->all());
        $request->validate([
            'start_date' => 'required|date',
            'month_count' => 'required|integer|min:1',
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255',
            'phone' => 'required|string|max:20',
            'payment_method' => 'required|in:cash,gcash',
            'agreedToTerms' => 'required|accepted',
            'address.street' => 'required|string|max:255',
            'address.city' => 'required|string|max:255',
            'address.province' => 'required|string|max:255',
            'address.postal_code' => 'nullable|string|max:20',
            'address.country' => 'required|string|max:100',
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
            'addressable_id'   => $booking->id,
            'addressable_type' => Booking::class,
            'street'           => $request->address['street'],
            'barangay'         => $request->address['barangay'],
            'city'             => $request->address['city'],
            'province'         => $request->address['province'],
            'postal_code'      => $request->address['postal_code'],
            'country'          => $request->address['country'],
        ]);

       return redirect()->route('accommodations.index')->with('success', 'Booking request created successfully.');

        // Only allow cash payment here



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
         $request->validate([
        'booking_id' => 'required|exists:bookings,id',
        'remarks' => 'nullable|string|max:255',
        'ref_number' => 'nullable|string|max:255',
        'payment_proof' => 'required|file|mimes:jpg,jpeg,png,pdf|max:2048',
    ]);
        Log::info('Booking request data: ', $request->all());
        $booking = Booking::where('id', $request->booking_id)->first();
        $booking->status = "paid";
        $booking->save();

        $path = $request->file('payment_proof')->store('receipts', 'public');

        Receipt::create([
            'booking_id' => $booking->id,
            'user_receipt' => $path,
            'payment_method' => 'gcash',
            'user_remarks' => $request->remarks,
            'user_ref_number' => $request->ref_number,
            'status' => 'pending',
            'amount' => $booking->total_price,
            'paid_at' => Carbon::now(),
        ]);

        return redirect()->route('accommodations.index');
    }

    /* Cancel booking */
    public function cancelBooking(Request $request,Booking $booking)
    {
        $booking->status = 'canceled';
        $booking->save();
        return redirect()->route('accommodations.cancelled')->with('success', 'Booking cancelled successfully.');
    }
}
