<?php

namespace App\Http\Controllers\Seller\BuildingApplication;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;

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
            'address' => 'required|string',
            'numberOfRooms' => 'required|integer',
            'numberOfBeds' => 'required|integer',
            'bir' => 'required|file|mimes:pdf|max:2048',  // Adjust the file validation as needed
            'fireSafetyCertificate' => 'required|file|mimes:pdf|max:2048', // Adjust the file validation as needed
        ]);

        // Handle file uploads and get their paths
        $birPath = $request->file('bir')->store('documents', 'public');
        $fireSafetyCertificatePath = $request->file('fireSafetyCertificate')->store('documents', 'public');

        // Create the BuildingApplication record
      

      
        // Return a response or redirect
        return response()->json([
            'message' => 'Thanks for applying! Please wait for our staff to review your application.'
        ]);
    }
}
