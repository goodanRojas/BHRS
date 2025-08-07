<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Building;
use Illuminate\Support\Facades\Log;
class MapController extends Controller
{
    public function index()
    {
         $boardingHouses = Building::with(['seller','routes.destination', 'address', 'feedback', 'rooms.beds.bookings.user:id,name,avatar,created_at'])->get();  // Assuming you have a model 'BoardingHouse'
        Log::info($boardingHouses);
        return Inertia::render('Map/MapBox',[
            'buildings' => $boardingHouses
        ]);
    }
}
