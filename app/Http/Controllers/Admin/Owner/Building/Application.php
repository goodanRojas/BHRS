<?php

namespace App\Http\Controllers\Admin\Owner\Building;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\{BuildingApplication, Building, Address};

class Application extends Controller
{
        
    public function index()
    {
        $applications = Building::all();
        return   Inertia::render('Admin/Owner/Building/Application', [
            'applications' => $applications
        ]);
    }

    public function store(Request $request)
    {
        // Log the incoming request data for debugging
        Log::info($request->all());

        // Find the application using the provided id
       
        // Log the found application
        $application = Building::find($request->id);
        // Handle the image upload if it exists in the request
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('public/building_images');
        }

        // Create the building using the application data and the image (if provided)
        $building = Building::create([
            'seller_id' => $application->seller_id,
            'name' => $application->building_name,
            'image' => $imagePath,  // Store image path
            'latitude' => $request->latitude,
            'longitude' => $request->longitude,
        ]);

        // Create the address for the building
        $address = Address::create([
            'addressable_id' => $building->id,
            'addressable_type' => Building::class,
            'street' => $request->street,  // Assuming street is passed in the request
            'barangay' => $request->barangay,  // Assuming barangay is passed in the request
            'city' => $request->city,  // Assuming city is passed in the request
            'province' => $request->province,  // Assuming province is passed in the request
            'postal_code' => $request->postal_code,  // Assuming postal_code is passed in the request
            'country' => $request->country,  // Assuming country is passed in the request
            'latitude' => $request->latitude,  // Latitude passed in the request
            'longitude' => $request->longitude,  // Longitude passed in the request
        ]);

        // Return a response (could be success message, etc.)
        return response()->json([
            'message' => 'Building application stored successfully!',
            'building' => $building,
            'address' => $address,
        ]);
    }
}
