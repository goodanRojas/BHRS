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
         $boardingHouses = Building::with(['routes', 'address', 'feedback'])->get();  // Assuming you have a model 'BoardingHouse'
        Log::info($boardingHouses);
        return Inertia::render('Map/MapBox',[
            'buildings' => $boardingHouses
        ]);
    }
}
