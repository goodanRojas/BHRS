<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Building;

class MapController extends Controller
{
    public function index()
    {
         $boardingHouses = Building::all();  // Assuming you have a model 'BoardingHouse'

        return Inertia::render('Map/MapComponent',[
            'buildings' => $boardingHouses
        ]);
    }
}
