<?php

namespace App\Http\Controllers\Seller\Requests;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth, Log, Hash, Storage};

use App\Models\{OwnerPaymentInfo, Receipt};
use App\Events\User\Booking\PaymentConfirmed;
class PaymentInfo extends Controller
{
    public function index(Request $request)
    {
        $ownerId = auth()->guard('seller')->user()->id;
        $receipts = Receipt::whereHas('booking.bookable.room.building', function ($query) use ($ownerId) {
            $query->where('seller_id', $ownerId);
        })
            ->with(['booking.user', 'booking.bookable'])
            ->get();
        return inertia('Seller/Guest/Request/Payments', [
            'Payments' => $receipts,
        ]);
    }
    public function show(Request $request, $id)
    {


        $payment = Receipt::with(['booking.user', 'booking.bookable'])
            ->findOrFail($id);
        return inertia('Seller/Guest/Request/Payment', [
            'payment' => $payment,
        ]);
    }

    public function confirm(Request $request)
    {
        $request->validate([
            'payment_id' => 'required|exists:receipts,id',
            'remarks' => 'nullable',
            'ref_number' => 'nullable',
            'receipt' => 'image|mimes:jpg,jpeg,png,pdf|max:2048',
        ]);
        Log::info($request);
        $receipt = Receipt::find($request->payment_id);
        $receipt->status = 'completed';
        $receipt->owner_remarks = $request->remarks;
        $receipt->owner_ref_number = $request->ref_number;


        if ($request->hasFile('receipt')) {
            $path = $request->file('receipt')->store('receipts', 'public');
            $receipt->seller_receipt = $path;
        }
        $receipt->save();
        $booking = $receipt->booking;
        $booking->status = 'completed';
        $booking->save();
        event( new PaymentConfirmed($booking));
        return redirect()->route('seller.request.payments.index')
            ->with('success', 'Payment has been confirmed successfully.');
    }
}
