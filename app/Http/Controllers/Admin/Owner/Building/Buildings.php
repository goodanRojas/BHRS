<?php

namespace App\Http\Controllers\Admin\Owner\Building;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Models\{Room, Bed, Building, Address, Seller, Feature};

class Buildings extends Controller
{
    public function index()
    {
        $buildings = Building::with('seller', 'address')->orderBy('created_at', 'desc')->paginate(10);
        return Inertia::render('Admin/Owner/Building/Buildings', [
            'buildings' => $buildings
        ]);
    }
    public function createShow(Request $request)
    {
        $sellers = Seller::select('id', 'name', 'avatar')->get();
        return Inertia::render('Admin/Owner/Building/CreateBuilding', [
            'sellers' => $sellers
        ]);
    }

    public function store(Request $request)
    {
        // Handle file uploads
        $imagePath = $request->hasFile('image')
            ? $request->file('image')->storeAs('images', $request->file('image')->hashName(), 'public')
            : null;

        $birPath = $request->hasFile('bir')
            ? $request->file('bir')->storeAs('pdfs', $request->file('bir')->hashName(), 'public')
            : null;

        $fireSafetyCertificatePath = $request->hasFile('fireSafetyCertificate')
            ? $request->file('fireSafetyCertificate')->storeAs('pdfs', $request->file('fireSafetyCertificate')->hashName(), 'public')
            : null;

        // Create building
        $building = Building::create([
            'seller_id' => $request->owner_id,
            'image' => $imagePath,
            'name' => $request->buildingName,
            'longitude' => $request->longitude,
            'latitude' => $request->latitude,
            'number_of_floors' => $request->numberOfFloors,
            'bir' => $birPath,
            'business_permit' => $fireSafetyCertificatePath,
            'number_of_rooms' => $request->numberOfRooms,
            'status' => 1,
        ]);

        if ($building) {
            // Create address (nested JSON from form)
            $address = Address::create([
                'addressable_id' => $building->id,
                'addressable_type' => Building::class,
                'address' => $request->address, // will be JSON
                'latitude' => $request->latitude,
                'longitude' => $request->longitude,
            ]);

            // Optional: save amenities if needed
            if ($request->filled('aminities')) {
                foreach ($request->aminities as $amenity) {
                    Feature::create([
                        'featureable_id' => $building->id,
                        'featureable_type' => Building::class,
                        'name' => $amenity,
                    ]);
                }
            }

            return back()->with('message', 'Building successfully created');
        }
        return back()->with('message', 'An error occurred while creating the building');
    }


    public function show($id)
    {
        $building = Building::with('seller', 'address', 'images', 'rooms', 'features')->find($id);
        Log::info($building);
        return Inertia::render('Admin/Owner/Building/Room/Building', [
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


}
