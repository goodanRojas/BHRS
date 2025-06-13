<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Seller;
use App\Models\Booking;
use App\Models\Bed;
use App\Models\OwnerPaymentInfo;
use App\Models\Room;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class SellerRequestController extends Controller
{
    public function index()
    {
        $seller = Auth::guard('seller')->user();
        $buildingIds = $seller->buildings->pluck('id');
        $roomIds = Room::whereIn('building_id', $buildingIds)->pluck('id');

        $bedIds = Bed::whereIn('room_id', $roomIds)->pluck('id');
        // dd($bedIds);
        $bedRequests = Booking::with(['user', 'payment', 'bookable' => function ($morph) {
            $morph->with(['room.building']);
        }])
            ->where('bookable_type', Bed::class)
            ->whereIn('bookable_id', $bedIds)

            ->where('status', 'waiting')
            ->where('payment_method', 'gcash')
            ->get();

        $roomRequests = Booking::with(relations: ['user', 'payment', 'bookable' => function ($morph) {
            $morph->with('building');
        }])
            ->where('bookable_type', Room::class)
            ->whereIn('bookable_id', $roomIds)
            ->where('status', 'waiting')
            ->whereRaw('LOWER(payment_method) = ?', ['gcash'])
            ->get();
        $paymentInfo = OwnerPaymentInfo::where('owner_id', $seller->id)->first();
        // dd($paymentInfo);


        return Inertia::render('Seller/Guest/Request/Requests', [
            'bedRequests' => $bedRequests,
            'roomRequests' => $roomRequests,
            'paymentInfo' => $paymentInfo,
        ]);
    }
}
