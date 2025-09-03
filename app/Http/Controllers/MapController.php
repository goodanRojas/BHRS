<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\{Building, RouteDestination};
use Illuminate\Support\Facades\Log;

class MapController extends Controller
{
    public function index($buildingId = null)
    {
        $boardingHouses = Building::with(['seller', 'routes', 'address', 'feedback', 'rooms.beds.bookings.user:id,name,avatar,created_at'])->get();  // Assuming you have a model 'BoardingHouse'
        $destinations = RouteDestination::all();
        return Inertia::render('Map/MapBox', [
            'buildings' => $boardingHouses,
            'destinations' => $destinations,
            'focusId' => $buildingId
        ]);
    }
}
