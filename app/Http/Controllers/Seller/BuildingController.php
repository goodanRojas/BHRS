<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Building;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BuildingController extends Controller
{

    public function show(Request $request, Building $building = null)
    {
        $sellerId = Auth::guard('seller')->id();

        if ($building && $building->seller_id === $sellerId) {
            // Fetch specific building with rooms
            $building->load('rooms.beds', 'rooms.user');
            return Inertia::render('Seller/BuildingDetails', [
                'building' => $building,
            ]);
        }

        // Fetch all buildings for the seller
        $buildings = Building::with('rooms')->where('seller_id', $sellerId)->get();
        return Inertia::render('Seller/Buildings', [
            'buildings' => $buildings,
        ]);
    }

   
}
