<?php

namespace App\Http\Controllers\Seller\Requests;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth, Log, Hash, Storage};

use App\Models\{ChatGroup, DefaultMessage, OwnerPaymentInfo, Receipt, Seller, User, Message};
use App\Events\User\Booking\PaymentConfirmed;
use App\Notifications\User\BookingSetupCompleted;

class PaymentInfo extends Controller
{
    public function index(Request $request)
    {
        $ownerId = auth()->guard('seller')->user()->id;
        $receipts = Receipt::whereHas('booking.bookable.room.building', function ($query) use ($ownerId) {
            $query->where('seller_id', $ownerId);
        })
            ->with(['booking.user', 'booking.bookable'])
            ->orderBy('created_at', 'desc')
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

        $bed = $booking->bookable;
        $bed->is_occupied = true;
        $bed->save();
        event(new PaymentConfirmed($booking));
        $booking->user->notify(new BookingSetupCompleted($booking));
        // Afther the user has booked he/she is then added to the gc of this building

        $group = ChatGroup::firstOrCreate([
            'building_id' => $booking->bookable->room->building_id,
        ], [
            'name' => 'Building ' . $booking->bookable->room->building->name . ' Group',
            'avatar' => null,
        ]);
        $group->members()->syncWithoutDetaching([$booking->user_id]);

        //Notify the user after he/she is added to the group and broadcast an event
        $owner = auth()->guard('seller')->user();
        $message = DefaultMessage::where('type', 'tenant_welcome')->first();

        Message::create([
            'sender_id' => $owner->id,
            'sender_type' => Seller::class,
            'receiver_id' => $booking->user_id,
            'receiver_type' => User::class,
            'content' => $message->message,
        ]);

        return redirect()->route('seller.request.payments.index')
            ->with('success', 'Payment has been confirmed successfully.');
    }
}
