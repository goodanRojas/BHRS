<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Building;
use App\Models\Room;
use App\Models\Bed;
use Illuminate\Http\Request;
use Inertia\Inertia;


class SellerDashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $buildingCount = Building::count(); // Count of buildings
        $roomCount = Room::count();         // Count of rooms
        $bedCount = Bed::count();           // Count of beds
        $roomsWithUserCount = Room::whereNotNull('user_id')->count();
        $bedsWithUserCount = Bed::whereNotNull('user_id')->count();
        return Inertia::render("Seller/Dashboard", [
            'count' => [
                'buildings' => $buildingCount,
                'rooms' => $roomCount,
                'beds' => $bedCount,
                'roomsWithUser' => $roomsWithUserCount,
                'bedsWithUser' => $bedsWithUserCount,
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
