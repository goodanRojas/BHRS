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

        // Validate the data
        /*  $validate = $request->validate([
            'seller_id' => 'required|exists:sellers,id',
            'image' => 'required|image|max:2048',
            'bir' => 'required|file|max:2048',
            'business_permit' => 'required|file|max:2048',
            'name' => 'required|string|max:255',
            'long' => 'required|numeric',
            'lat' => 'required|numeric',
            'number_of_floors' => 'required|numeric',
        ]); */
        Log::info("Hello 1");

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imagePath = $image->storeAs('images', $image->hashName(), 'public');
        }
        if ($request->hasFile('bir')) {
            $bir = $request->file('bir');
            $birPath = $bir->storeAs('pdfs', $bir->hashName(), 'public');
        }
        if ($request->hasFile('business_permit')) {
            $businessPermit = $request->file('business_permit');
            $businessPermitPath = $businessPermit->storeAs('pdfs', $businessPermit->hashName(), 'public');
        }

        Log::info("Hello 1");
        $building = Building::create([
            'seller_id' => $request->owner_id,
            'image' => $imagePath ?? null,
            'name' => $request->name,
            'longitude' => $request->long,
            'latitude' => $request->lat,
            'number_of_floors' => $request->number_of_floors,
            'bir' => $birPath ?? null,
            'business_permit' => $businessPermitPath ?? null, // Use null coalescing operator to handle optional files
            'status' => 1
        ]);
        Log::info($building);
        if ($building) {
            Log::info("Building created successfully");
            $address = Address::create([
                'addressable_id' => $building->id,
                'addressable_type' => Building::class,
                'street' => $request->street,  // Assuming street is passed in the request
                'barangay' => $request->barangay,  // Assuming barangay is passed in the request
                'city' => $request->city,  // Assuming city is passed in the request
                'province' => $request->province,  // Assuming province is passed in the request
                'postal_code' => $request->postal_code,  // Assuming postal_code is passed in the request
                'country' => $request->country,  // Assuming country is passed in the request
                'latitude' => $request->lat,  // Latitude passed in the request
                'longitude' => $request->long,  // Longitude passed in the request
            ]);
            if ($address) {
                return response()->json([
                    'message' => 'Building successfully created'
                ]);
            }
        }

        return response()->json([
            'message' => 'An error occurred while creating the building'
        ], 500);
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
