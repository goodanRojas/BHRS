<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\{Payment, Building, Room, Bed};
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

class SellerDashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sellerId = auth()->guard('seller')->user()->id;
        $buildingIds = Building::where('seller_id', $sellerId)->pluck('id');
        $roomIds = Room::whereIn('building_id', $buildingIds)->pluck('id');
        $bedIds = Bed::whereIn('room_id', $roomIds)->pluck('id');
        $buildingCount = $buildingIds->count();
        $roomCount = $roomIds->count();
        $bedCount = $bedIds->count();


        $payedBookingsCount = Payment::where('status', 'completed')
            ->whereIn('booking_id', function ($query) use ($bedIds, $roomIds) {
                $query->select('id')
                    ->from('bookings')
                    ->where(function ($q) use ($bedIds, $roomIds) {
                        $q->where(function ($q1) use ($bedIds) {
                            $q1->whereIn('bookable_id', $bedIds)
                                ->where('bookable_type', Bed::class);
                        })->orWhere(function ($q2) use ($roomIds) {
                            $q2->whereIn('bookable_id', $roomIds)
                                ->where('bookable_type', Room::class);
                        });
                    });
            })->count();
        return Inertia::render("Seller/Dashboard", [
            'count' => [
                'buildings' => $buildingCount,
                'rooms' => $roomCount,
                'beds' => $bedCount,
                'payedBookingsCount' => $payedBookingsCount,
            ],
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
