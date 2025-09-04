<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\BuildingApplication;
use Illuminate\Support\Facades\Log;
class BuildingRequestController extends Controller
{
    public function index()
    {
        $owner = auth()->guard('seller')->user();
        $applications = BuildingApplication::where('seller_id', $owner->id)->get();

        return Inertia::render('Seller/Application/Requests', [
            'requests' => $applications
        ]);
    }

    public function cancel($id)
    {
        $application = BuildingApplication::find($id);

        if ($application) {
            $application->status = 'cancelled';
            $application->save();

            return response()->json([
                'success' => true,
                'message' => 'Request cancelled successfully.',
                'application' => $application
            ], 200);
        }

        return response()->json([
            'success' => false,
            'message' => 'Request not found.'
        ], 404);
    }

}
