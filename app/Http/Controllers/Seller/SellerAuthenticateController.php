<?php

namespace App\Http\Controllers\Seller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
class SellerAuthenticateController
{
    public function index(Request $request)
    {
        return Inertia::render('Seller/Login', [
            'canResetPassword' => Route::has('password.request'),
            'canRegister' => Route::has('register'),
            'status' => session('status'),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        // Validate the incoming request
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        // Attempt authentication with the seller guard
        if (!Auth::guard('seller')->attempt($credentials, $request->boolean('remember'))) {
            throw ValidationException::withMessages([
                'email' => __('auth.failed'),
            ]);
        }

        // Regenerate the session to prevent session fixation attacks
        $request->session()->regenerate();

        // Redirect to the seller dashboard
        return redirect()->intended(route('seller.dashboard.index', absolute: false));
    }

    public function destroy(Request $request)
    {
         // Log out the seller from the custom 'seller' guard
    Auth::guard('seller')->logout();

    // Invalidate the current session
    $request->session()->invalidate();

    // Regenerate the CSRF token to prevent session fixation
    $request->session()->regenerateToken();
        return redirect()->route('seller.login');
    }
}
