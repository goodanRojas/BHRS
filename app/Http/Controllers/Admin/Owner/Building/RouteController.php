<?php

namespace App\Http\Controllers\Admin\Owner\Building;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\{Building, Route, RouteDestination};

class RouteController extends Controller
{
    public function index(Building $building)
    {
        $building->load(['routes']);
        $destinations = RouteDestination::all();
        return Inertia::render('Admin/Owner/Building/Room/RouteMap', [
            'building' => $building,
            'destinations' => $destinations
        ]);
    }
    public function saveRoute(Request $request)
    {
        $validated = $request->validate([
            'buildingId' => 'required|exists:buildings,id',
            'routes' => 'required|array',
            'routes.*.lat' => 'required|numeric',
            'routes.*.lng' => 'required|numeric',
        ]);



        $route = Route::create([
            'building_id' => $validated['buildingId'],
            'coordinates' => json_encode($validated['routes']),
        ]);

        return redirect()->back()->with('success', 'Route created successfully!');
    }
    public function destroy($id)
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
