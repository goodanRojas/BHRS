<?php

namespace App\Http\Controllers;

use App\Http\Requests\ProfileUpdateRequest;
use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;
use App\Models\User;
use App\Models\Address;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit(Request $request): Response
    {
        $address = Address::where('addressable_id', $request->user()->id)
            ->where('addressable_type', User::class)
            ->first();
        // Log::info('Address retrieved for user ID: ' . $request->user()->id, ['address' => $address]);
        return Inertia::render('Profile/Edit', [
            'mustVerifyEmail' => $request->user() instanceof MustVerifyEmail,
            'status' => session('status'),
            'address' => $address,
        ]);
    }

  
    public function update(Request $request)
    {
        // Manually validate the input data
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($request->user()->id)],
            'avatar' => ['nullable', 'image', 'mimes:jpg,jpeg,png,gif'],
            'phone' => ['nullable', 'string'],
            'address' => ['nullable', 'array'],
            // Address validation fields
            'address.street' => ['nullable', 'string'],
            'address.city' => ['nullable', 'string'],
            // Add other address validation rules if needed
        ]);


        $user = $request->user();

        // Update user fields excluding address-related fields
        $user->fill($validated);

        // Handle the avatar upload if a new image is provided
        if ($request->hasFile('avatar')) {
            // Delete the old avatar if it exists
            if ($user->avatar) {
                Storage::delete($user->avatar);
            }

            // Store the new avatar and get the file path
            $path = $request->file('avatar')->store('profile', 'public');

            // Update the avatar field in the user model
            $user->avatar = $path;
        }

        // Handle phone number and address logic
        $user->phone = $request->input('phone');

        // Handle the address update via polymorphic relationship
        if ($user->address) {
            $user->address->update($request->input('address'));
            Log::info('Address updated: ', $user->address->toArray());
        } else {
            if ($request->filled('address')) {
                $user->address()->create($request->input('address') + [
                    'addressable_id' => $user->id,
                    'addressable_type' => User::class,
                ]);
                Log::info('New address created: ', $user->address->toArray());
            }
        }

        // Save the updated user model
        $user->save();

        // Redirect back to the profile edit page with a success message
        return Redirect::route('profile.edit')->with('success', 'Profile updated successfully.');
    }

    /**
     * Delete the user's account.
     */
    public function destroy(Request $request): RedirectResponse
    {
        $request->validate([
            'password' => ['required', 'current_password'],
        ]);

        $user = $request->user();

        Auth::logout();

        $user->delete();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Redirect::to('/');
    }
}
