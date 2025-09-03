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
            'address' => ['nullable', 'array'],
            // Address validation fields
            'address.street' => ['nullable', 'string'],
            'address.city' => ['nullable', 'string'],
            // Add other address validation rules if needed
        ]);


        $seller = auth()->guard('seller')->user();
        $address = Address::where('addressable_id', $seller->id)
            ->where('addressable_type', Seller::class)
            ->first();
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

        // Handle the address update via polymorphic relationship
        if ($address) {
            // Log::info($seller->address);
            $address->update($request->input('address'));
        } else {
            if ($request->filled('address')) {
                $address->create($request->input('address') + [
                    'addressable_id' => $seller->id,
                    'addressable_type' => Seller::class,
                ]);
            }
        }

        // Save the updated seller model
        $seller->save();

        // Redirect back to the profile edit page with a success message
        return Redirect::route('seller.profile.edit')->with('success', 'Profile updated successfully.');
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
