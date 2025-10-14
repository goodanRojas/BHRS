<?php

namespace App\Http\Controllers\Admin\Owner;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\{SellerApplication, Address, DefaultMessage, Seller};
use App\Notifications\User\SellerApplicationApproved;
class OwnerApplicationController extends Controller
{

    public function index()
    {
        $applications = SellerApplication::with(['address', 'user'])->get();
        return inertia('Admin/Owner/Request/OwnerApplications', [
            'applications' => $applications
        ]);
    }

    public function show(SellerApplication $application)
    {
        $application->load(['address', 'user']);
        return inertia('Admin/Owner/Request/OwnerApplication', [
            'application' => $application
        ]);
    }

    public function approve(SellerApplication $application)
    {
        if ($application->user) {
            $application->user->notify(new SellerApplicationApproved($application)); // ✅ fixed class name + relation
        }
        $application->status = 'approved';
        $application->save();
        $seller =Seller::create([
            'name' => $application->fullname,
            'email' => $application->email,
            'password' => $application->password,
            'phone' => $application->phone,
        ]);
        DefaultMessage::create([
            'type' => Seller::class,
            'owner_id' => $seller->id,
            'message' => "Thanks for checking in. If you have any questions, feel free to ask here. Enjoy your stay!",
            'remarks' => "tenant_welcom",
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Application approved successfully.',
        ]);
    }

    public function reject(SellerApplication $application)
    {
        $application->status = 'rejected';
        $application->save();
        return response()->json([
            'success' => true,
            'message' => 'Application rejected successfully.',
        ]);
    }
}
