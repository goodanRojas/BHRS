<?php

namespace App\Http\Controllers\Booking;

use App\Http\Controllers\Controller;
use App\Events\NewBookingCreated;
use App\Models\{OwnerPaymentInfo, Payment, Address, Bed, Booking};
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
        // Log::info('Booking request data: ', $request->all());
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

        // Only allow cash payment here


        $bed = Bed::findOrFail($bedId);
        $startDate = Carbon::parse($request->start_date);
        $endDate = $startDate->copy()->addMonths($request->month_count);

        $totalPrice = $bed->price * $request->month_count;

        $booking = Booking::create([
            'user_id' => auth()->id(),
            'bookable_id' => $bed->id,
            'bookable_type' => Bed::class,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'total_price' => $totalPrice,
            'fullname' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'special_request' => $request->special_request,
            'status' => 'pending',
            'agreed_to_terms' => $request->agreedToTerms,
            'payment_method' => $request->payment_method,
        ]);

        if ($booking) {
            $address = Address::create([
                'addressable_id' => $booking->id,
                'addressable_type' => Booking::class,
                'street' => $request->input('address.street'),
                'barangay' => $request->input('address.barangay'),
                'city' => $request->input('address.city'),
                'province' => $request->input('address.province'),
                'postal_code' => $request->input('address.postal_code'),
                'country' => $request->input('address.country'),
            ]);

            if ($address) {
                $booking->load('bookable.room.building.seller');
                $monthCount = $request->month_count;
                event(new NewBookingCreated($booking, $monthCount));
            }
        }
        if ($request->payment_method == 'gcash') {
            return redirect()->route('bed.book.initiate.gcash', [
                'bedId' => $bedId,
                'amount' => $request->total_price,
            ]);
        }

        return back()->with(['success' => true, 'booking' => $booking]);
    }

    public function initiateGCashBooking(Request $request)
    {
        // Find the bed based on the provided bed ID
        $bed = Bed::findOrFail($request->bedId);

        // Check if there is an existing 'pending' booking for the logged-in user and the selected bed
        $pending = Booking::where('user_id', auth()->id())
            ->where('bookable_id', $bed->id)
            ->where('bookable_type', Bed::class)
            ->where('status', 'pending')
            ->first();

        if ($pending) {
            // Update the pending booking to 'waiting'
            $pending->update(['status' => 'waiting']);

            // Handle the payment proof file if present
            if ($request->hasFile('paymentProof')) {
                $paymentProof = $request->file('paymentProof');

                // Ensure the file is valid and store it
                if ($paymentProof->isValid()) {
                    $paymentProofPath = $paymentProof->storeAs('images', $paymentProof->hashName(), 'public');
                    // Update the booking with the receipt path
                    Payment::create([
                        'user_id' => auth()->id(),
                        'booking_id' => $pending->id,
                        'amount' => $pending->total_price,
                        'payment_method' => 'gcash',
                        'status' => 'completed',
                        'transaction_id' => $pending->id, // Use booking ID as transaction ID
                        'receipt' => $paymentProofPath,
                        'paid_at' => now(),
                    ]);
                } else {
                    return redirect()->back()->withErrors(['paymentProof' => 'Invalid payment proof file.']);
                }
            }
        } else {
            // No pending booking found
            return redirect()->back()->withErrors(['booking' => 'No pending booking found for this bed.']);
        }

        // Redirect to accommodations index
        return redirect(route('accommodations.index'));
    }

    // Show GCash payment page with React/Inertia
    public function showGCashPaymentPage($bedId, $amount)
    {
        $gcashNumber = '09630012342'; // your number
        $staticQrUrl = asset('storage/system/gcash_static_qr.webp');
        $paymentInfo = $ownerPaymentInfo = Bed::find($bedId)
            ->room          // Get the room the bed belongs to
            ->building      // Get the building the room belongs to
            ->seller        // Get the seller who owns the building
            ->paymentInfo;  // Get the seller's OwnerPaymentInfo

        // dd($paymentInfo);
        return Inertia::render('Home/Booking/GcashPayment', [
            'bedId' => $bedId,
            'amount' => $amount,
            'paymentInfo' => $paymentInfo,
        ]);
    }
}
