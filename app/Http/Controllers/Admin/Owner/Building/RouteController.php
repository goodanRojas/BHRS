<?php

namespace App\Http\Controllers\Admin\Owner\Building;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\{Building, Route};

class RouteController extends Controller
{
    public function index(Building $building)
    {
        $building->load(['routes']);
        return Inertia::render('Admin/Owner/Building/Room/RouteMap', [
            'building' => $building,
        ]);
    }
    public function saveRoute(Request $request)
    {
        $validated = $request->validate([
            'buildingId' => 'required|exists:buildings,id',
            'routeCoordinates' => 'required|array',
        ]);

        // Save the route data
        $route = Route::create([
            'building_id' => $validated['buildingId'],
            'coordinates' => $validated['routeCoordinates'],
        ]);

        return response()->json(['message' => 'Route saved successfully!', 'route' => $route]);
    }
     public function delete($id)
    {
        // Find the route by its ID
        $route = Route::findOrFail($id);

        // Delete the route from the database
        $route->delete();

        // Respond with a success message
        return response()->json([
            'message' => 'Route deleted successfully!',
        ], 200);
    }
}
