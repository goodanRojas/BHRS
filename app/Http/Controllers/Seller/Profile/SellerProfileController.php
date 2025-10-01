<?php

namespace App\Http\Controllers\Seller\Profile;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\{Address, Seller};
use Illuminate\Support\Facades\{Auth, Redirect, Storage, Log};
use Illuminate\Validation\Rule;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Inertia\Inertia;

class SellerProfileController extends Controller
{
    //


    /**
     * Display the seller's profile form.
     */
    public function edit(Request $request)
    {
        $seller_id = auth()->guard('seller')->id();
        $address = Address::where('addressable_id', $seller_id)
            ->where('addressable_type', Seller::class)
            ->first();

        // Log::info('Address retrieved for seller ID: ' . $request->seller()->id, ['address' => $address]);
        return Inertia::render('Seller/Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'address' => $address,
        ]);
    }


    public function update(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('sellers')->ignore(auth()->guard('seller')->id())],
            'avatar' => ['nullable', 'image', 'mimes:jpg,jpeg,png,gif'],
            'phone' => ['nullable', 'string'],
        ]);


        $seller = auth()->guard('seller')->user();
       
        // Update seller fields excluding address-related fields
        $seller->fill($validated);

        // Handle the avatar upload if a new image is provided
        if ($request->hasFile('avatar')) {
            // Delete the old avatar if it exists
            if ($seller->avatar) {
                Storage::delete($seller->avatar);
            }

            // Store the new avatar and get the file path
            $path = $request->file('avatar')->store('profile', 'public');

            // Update the avatar field in the seller model
            $seller->avatar = $path;
        }

        // Handle phone number and address logic
        $seller->phone = $request->input('phone');
        $seller->save();
        // Redirect back to the profile edit page with a success message
        return Redirect::route('seller.profile.edit')->with('success', 'Profile updated successfully.');
    }
    public function updateAddress(Request $request)
    {
        Log::info($request);
        $validated = $request->validate([
            'address' => ['required', 'array'],
        ]);
        $address = Address::updateOrCreate(
            [
                // 🔑 Unique key for this user
                'addressable_id' => auth()->id(),
                'addressable_type' => Seller::class,
            ],
            [
                // ✅ Data to update
                'address' => $validated['address'],
            ]
        );
        Log::info($address);

        return back();
    }
    /**
     * Delete the seller's account.
     */
    public function destroy(Request $request)
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $seller = auth()->guard('seller')->user();

        Auth::logout();

        $seller->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
