<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Models\{Building, Feature, Room, Address};

class BuildingController extends Controller
{
    public function index(Request $request)
    {
        $sellerId = Auth::guard('seller')->id();
        // Fetch all buildings for the seller
        $buildings = Building::with('rooms', 'seller')->where('seller_id', $sellerId)->get();
        return Inertia::render('Seller/Buildings', [
            'initialBuildings' => $buildings,
        ]);
    }
    public function searchBuildings(Request $request)
    {
        $search = $request->query('search');

        $buildings = Building::with('rooms', 'seller')
            ->when(
                $search,
                fn($query) =>
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%')
                        ->orWhere('address', 'like', '%' . $search . '%');
                })
            )
            ->where('seller_id', Auth::guard('seller')->id())
            ->get();

        return response()->json($buildings);
    }


    public function showBuilding($id)
    {
        $building = Building::with('seller', 'address', 'images', 'rooms', 'features')->find($id);
        Log::info($building);
        return Inertia::render('Seller/Building', [
            'building' => $building
        ]);
    }

    public function addFeature(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'featureable_id' => 'required|exists:buildings,id', // Assuming featureable_id is related to Building
        ]);
        $feature = Feature::create([
            'name' => $request->name,
            'description' => $request->description,
            'featureable_id' => $request->featureable_id,
            'featureable_type' => Building::class
        ]);
        Log::info($feature);
        return response()->json([
            'feature' => $feature
        ]);
    }
    public function deleteFeature($id)
    {
        // Find the feature by ID
        $feature = Feature::findOrFail($id);

        // Delete the feature
        $feature->delete();


        return response()->json([
            'message' => 'Feature deleted successfully.'
        ], 200);
    }

    public function addRoom(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'price' => 'required|numeric',
            'image' => 'required|image|',
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imagePath = $image->storeAs('images', $image->hashName(), 'public');
        }

        $rooms = Room::create([
            'building_id' => $request->building_id,
            'name' => $request->name,
            'image' => $imagePath,
            'price' => $request->price,
        ]);
        return response()->json([
            'room' => $rooms
        ]);
    }

    public function update(Request $request, Building $building)
    {
        Log::info($request->all());
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable|string', // adjust if it's an upload
            'address' => 'required|array',
            'address.region' => 'nullable|string',
            'address.province' => 'nullable|string',
            'address.municipality' => 'nullable|string',
            'address.barangay' => 'nullable|string',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);

        $building->update([
            'name' => $validated['name'],
            'image' => $validated['image'] ?? $building->image,
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
        ]);
        $address = Address::where('addressable_id', $building->id)
            ->where('addressable_type', Building::class)
            ->first();
        $address->update([
            'address' => [
                'region' => $request->input('address.region'),
                'province' => $request->input('address.province'),
                'municipality' => $request->input('address.municipality'),
                'barangay' => $request->input('address.barangay'),
            ],
            'latitude' => $request->input('latitude'),
            'longitude' => $request->input('longitude'),
        ]);

        return response()->json([
            'message' => 'Building updated successfully',
            'building' => $building,
        ]);
    }
}
