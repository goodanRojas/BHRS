<?php

namespace App\Http\Controllers\Seller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\Auth\SellerLoginRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Models\Subscription;
class SellerAuthenticateController
{

    public function currentSubscription()
    {
        $owner = auth()->guard('seller')->user();

        $subscription = Subscription::where('seller_id', $owner->id)
            ->latest('created_at')
            ->with('plan')
            ->first();

        if (!$subscription || $subscription->status !== 'active' || ($subscription->end_date && $subscription->end_date->isPast())) {
            return response()->json(['subscription' => null]);
        }

        return response()->json(['subscription' => $subscription]);
    }

    public function store(Request $request)
    {
        $validate = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (Auth::guard('seller')->attempt(['email' => $validate['email'], 'password' => $validate['password']])) {
            Log::info("Seller Is authenticated! ");
            return redirect()->intended(route('seller.dashboard.index', absolute: false));
        } else {
            Log::info("Seller is not authenticated");
            return back()->withErrors(['email' => 'Invalid Credentials']);
        }
    }


    public function destroy(Request $request)
    {
        // Log out the seller from the custom 'seller' guard
        Auth::guard('seller')->logout();

        // Invalidate the current session
        $request->session()->invalidate();

        // Regenerate the CSRF token to prevent session fixation
        $request->session()->regenerateToken();
        return redirect()->route('seller.login.index');
    }
}
