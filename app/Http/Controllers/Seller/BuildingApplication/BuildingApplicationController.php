<?php

namespace App\Http\Controllers\Seller\BuildingApplication;

use App\Events\Admin\NewBuildingApplicationEvent;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Models\{BuildingApplication, Admin};
use App\Notifications\Admin\NewBuildingNotification;

class BuildingApplicationController extends Controller
{
    public function index()
    {
        return Inertia::render("Seller/Application/MultiStepForm");
    }
    public function store(Request $request)
    {
        Log::info($request->all());
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
            'bir' => 'required|file|mimes:pdf|max:2048',
            'fireSafetyCertificate' => 'required|file|mimes:pdf|max:2048',
        ]);
        $birPath = $request->file('bir')->store('documents', 'public');
        $fireSafetyCertificatePath = $request->file('fireSafetyCertificate')->store('documents', 'public');

        // Save to DB
        $application = BuildingApplication::create([
            'seller_id' => $id,
            'name' => $validated['buildingName'],
            'number_of_floors' => $validated['numberOfFloors'],
            'address' => $validated['address'], // will be JSON
            'number_of_rooms' => $validated['numberOfRooms'],
            'amenities' => $validated['aminities'] ?? [],
            'bir' => $birPath,
            'fire_safety_certificate' => $fireSafetyCertificatePath,
        ]);

        $admin = Admin::find(1);
        $admin->notify(new NewBuildingNotification($application)); //TODO: The event and notification is to be setup
        event(new NewBuildingApplicationEvent($application)); 


        return redirect()->back()->with('success', 'Thanks for applying! Please wait for our staff to review your application.');
    }
}
