<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Log, Hash, Storage};
use App\Models\{SellerApplication, Address};
class SellerRegisterController extends Controller
{
    public function index()
    {
        $count = SellerApplication::where('user_id', auth()->id())
            ->where('status', 'pending')
            ->count();
        $approvedCount = SellerApplication::where('user_id', auth()->id())->where('status', 'approved')->count();
        return inertia('Seller/Auth/Register', [
            'applicationCount' => $count,
            'approvedCount' => $approvedCount,
        ]);
    }

    public function store(Request $request)
    {

        Log::info($request->all());
        $validated = $request->validate([
            'fullname' => 'required|string|max:255',
            'phone' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:sellers',
            'password' => 'required|string|min:8|confirmed',
            'password_confirmation' => 'required|string|min:8',
            'address.region' => 'required|string|max:255',
            'address.province' => 'required|string|max:255',
            'address.municipality' => 'required|string|max:255',
            'address.barangay' => 'required|string|max:255',
            'landOwnerPaper' => 'nullable|file|mimes:pdf,jpg,jpeg,png',
            'bir' => 'nullable|file|mimes:pdf,jpg,jpeg,png',
        ]);
        $landOwnerPath = $request->file('landOwnerPaper') ?
            $request->file('landOwnerPaper')->store('land_owners', 'public')
            : null;

        $birPath = $request->file('bir') ?
            $request->file('bir')->store('documents', 'public')
            : null;
        $application = SellerApplication::create([
            'fullname' => $validated['fullname'],
            'user_id' => auth()->id(),
            'email' => $validated['email'],
            'phone' => $validated['phone'],
            'password' => Hash::make($validated['password']),
            'landOwnerPaper' => $landOwnerPath,
            'bir' => $birPath,
        ]);
        Address::create([
            'addressable_id' => $application->id,
            'addressable_type' => SellerApplication::class,
            'address' => $validated['address'],
        ]);
        return redirect()->back()->with('success', 'Application submitted successfully!');

    }

    public function show()
    {
        $applications = SellerApplication::with('address')->where('user_id', auth()->id())->get();
        return inertia('Seller/Auth/Request', [
            'applications' => $applications,
        ]);
    }

    public function cancel($id)
    {
        $application = SellerApplication::findOrFail($id);
        $application->status = 'cancelled';
        $application->save();

        return response()->json([
            'success' => true,
            'message' => 'Application cancelled successfully.',
            'application' => $application
        ]);
    }

    public function approved()
    {
        $approved = SellerApplication::where('user_id', auth()->id())->where('status', 'approved')->get();
        return inertia('Seller/Auth/Approved', [
            'approved' => $approved,
        ]);
    }

    public function showApproved(SellerApplication $application)
    {
        $application->load(['address', 'user']);
        return inertia('Seller/Auth/ShowApproved', [
            'application' => $application
        ]);
    }

}
