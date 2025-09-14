<?php

namespace App\Http\Controllers\Admin\Owner\Building;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Log, Auth};
use Inertia\Inertia;
use App\Models\{BuildingApplication, Building, Address};

class Application extends Controller
{

    public function index()
    {
        $admin = Auth::guard('admin')->user();
        $applications = BuildingApplication::with('seller')->where('status', 'pending')->latest()->get();
        return Inertia::render('Admin/Owner/Building/BuildingApplications', [
            'applications' => $applications,
            'admin' => $admin
        ]);
    }

    public function show(BuildingApplication $application)
    {
        $application->load(['seller', 'address']); // eager load seller and address details

        return Inertia::render('Admin/Owner/Building/ShowBuildingApplication', [
            'application' => $application,
        ]);
    }



    public function store(Request $request)
    {
        $application = BuildingApplication::findOrFail($request->id);
        $application->status = "approved";
        $application->save();
        // Handle image upload



        // Create the building using application data
        $building = Building::create([
            'number_of_floors' => $application->number_of_floors,
            'seller_id' => $application->seller_id,
            'name' => $application->name, // you used $application->building_name but model has "name"
            'image' => $application->image,
            'status' => 1,
            'bir' => $application->bir,
            'business_permit' => $application->fire_safety_certificate,
            'latitude' => $application->latitude,
            'longitude' => $application->longitude,
        ]);
        // Create the address using application data
        Address::create([
            'addressable_id' => $building->id,
            'addressable_type' => Building::class,
            'address' => $application->address->address,
            'longitude' => $application->longitude,
            'latitude' => $application->latitude,
        ]);

        return redirect()->route('admin.owner.building.application.index');
    }

    public function reject(BuildingApplication $application){
        $application->status = "rejected";
        $application->save();
        return redirect()->route('admin.owner.building.application.index')->with('success', 'Application rejected successfully.');
    }
}
