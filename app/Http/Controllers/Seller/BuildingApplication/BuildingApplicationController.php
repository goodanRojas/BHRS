<?php

namespace App\Http\Controllers\Seller\BuildingApplication;

use App\Events\Admin\NewBuildingApplicationEvent;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Models\{Address, BuildingApplication, Admin};
use App\Notifications\Admin\NewBuildingNotification;

class BuildingApplicationController extends Controller
{
    public function index()
    {
        return Inertia::render("Seller/Application/MultiStepForm");
    }
    public function store(Request $request)
    {
        // Log the incoming data
        $id = auth('seller')->id();

        // Validate the incoming request
        $validated = $request->validate([
            'buildingName' => 'required|string|max:255',
            'numberOfFloors' => 'required|integer',
            'address' => 'required|array',
            'address.region' => 'required|string',
            'address.province' => 'required|string',
            'address.municipality' => 'required|string',
            'address.barangay' => 'required|string',
            'numberOfRooms' => 'required|integer',
            'aminities' => 'nullable|array',
            'aminities.*' => 'string|max:255',
            'bir' => 'required|file|mimes:pdf,image/*',
            'fireSafetyCertificate' => 'required|file|mimes:pdf,image/*',
            'image' => 'required|file|mimes:jpg,jpeg,png,pdf|max:4096',
            'latitude' => 'nullable|numeric',
            'longitude' => 'nullable|numeric',
        ]);
        $birPath = $request->file('bir')->store('documents', 'public');
        $fireSafetyCertificatePath = $request->file('fireSafetyCertificate')->store('documents', 'public');
        $imagePath = null;
        if ($request->hasFile('image')) {
            $imagePath = $request->file('image')->store('building_images', 'public');
        }
        // Save to DB
        $application = BuildingApplication::create([
            'seller_id' => $id,
            'name' => $validated['buildingName'],
            'number_of_floors' => $validated['numberOfFloors'],
            'address' => $validated['address'], // will be JSON
            'number_of_rooms' => $validated['numberOfRooms'],
            'amenities' => $validated['aminities'] ?? [],
            'bir' => $birPath,
            'image' => $imagePath,
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'fire_safety_certificate' => $fireSafetyCertificatePath,
        ]);

        $address = Address::create([
            'addressable_id' => $application->id,
            'addressable_type' => BuildingApplication::class,
            'latitude' => $validated['latitude'] ?? null,
            'longitude' => $validated['longitude'] ?? null,
            'address' => $validated['address']
        ]);

        $admins = Admin::all();
        foreach ($admins as $admin) {
            event(new NewBuildingApplicationEvent($admin->id, $application));
            // $admin->notify(new NewBuildingNotification($application));
        }




        return redirect()->route('seller.building.requests.index')->with('success', 'Thanks for applying! Please wait for our staff to review your application.');
    }
}
