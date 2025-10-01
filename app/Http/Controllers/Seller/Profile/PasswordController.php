<?php

namespace App\Http\Controllers\Seller\Profile;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Support\Facades\Auth;

class PasswordController extends Controller
{

    public function update(Request $request)
    {
        $validated = $request->validate([
            'current_password' => [
                'required',
                function ($attribute, $value, $fail) use ($request) {
                    if (!Hash::check($value, Auth::guard('seller')->user()->password)) {
                        $fail('The current password is incorrect.');
                    }
                },
            ],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        $seller = Auth::guard('seller')->user();

        $seller->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back();
    }
}
