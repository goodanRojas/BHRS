<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Building;
use Inertia\Inertia;
class BuildingController extends Controller
{
    public function showToUserBuilding(Request $request, Building $building)
    {
      //  dd($building->id);
        if ($building->id) {
            // Fetch specific building with rooms
            $building->load('rooms.beds', 'rooms.user');
            return Inertia::render('Home/BuildingDetail', [
                'building' => $building,
            ]);
        }

        $buildings = Building::with('rooms')->get();
        // dd($buildings);
        return Inertia::render('Home/Building', [
            'buildings' => $buildings,
        ]);
    }
}
