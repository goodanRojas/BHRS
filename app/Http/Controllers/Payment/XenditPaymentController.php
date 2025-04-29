<?php

namespace App\Http\Controllers\Payment;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class XenditPaymentController extends Controller
{
    // This shows the user a thank you page after payment
    public function paymentSuccess()
    {
        return Inertia::render('Payment/Success'); // UI (we'll make this next)
    }

    // This is triggered by Xendit when payment is complete
    public function handleCallback(Request $request)
    {
        Log::info('Xendit callback received', $request->all());

        $externalId = $request->input('external_id'); // e.g., "booking-id-123"
        $status = $request->input('status'); // e.g., "SUCCEEDED" or "FAILED"

        if ($externalId && str_contains($externalId, 'booking-id-')) {
            $bookingId = str_replace('booking-id-', '', $externalId);

            $booking = Booking::find($bookingId);

            if ($booking) {
                $booking->status = $status === 'SUCCEEDED' ? 'confirmed' : 'cancelled';
                $booking->save();
            }
        }

        return response()->json(['message' => 'Callback received']);
    }
}
