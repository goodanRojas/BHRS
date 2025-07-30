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
        $building->load(['routes.destination']);
        return Inertia::render('Admin/Owner/Building/Room/RouteMap', [
            'building' => $building,
        ]);
    }
    public function saveRoute(Request $request)
    {
        $validated = $request->validate([
            'buildingId' => 'required|exists:buildings,id',
            'name' => 'required|string|max:255',
            'category' => 'required|string|max:255',
            'description' => 'nullable|string|max:255',
            'latitude' => 'required|numeric',
            'longitude' => 'required|numeric',
            'routes' => 'required|array',
            'routes.*.lat' => 'required|numeric',
            'routes.*.lng' => 'required|numeric',
            'image' => 'nullable|image|max:2048',
        ]);

        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('destination_images', 'public');
        }
        $routeDestination = RouteDestination::create([
            'name' => $validated['name'],
            'image' => $imagePath,
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'category' => $validated['category'],
            'description' => $validated['description'],
        ]);

        $route = Route::create([
            'building_id' => $validated['buildingId'],
            'coordinates' => json_encode($validated['routes']),
            'destination_id' => $routeDestination->id,
        ]);

        return redirect()->back()->with('success', 'Route created successfully!');
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
