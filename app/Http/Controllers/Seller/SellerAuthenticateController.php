<?php

namespace App\Http\Controllers\Seller;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Requests\Auth\SellerLoginRequest;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Log, Route, RateLimiter};
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use App\Models\{Subscription, Seller, AdminLog};
class SellerAuthenticateController
{

    public function create()
    {
        return Inertia::render('Seller/Auth/Login', [
            'canResetPassword' => Route::has('seller.password.request'),
            'status' => session('status'),
        ]);
    }
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
        $this->ensureIsNotRateLimited($request);
        $validate = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);
        if (
            Auth::guard('seller')->attempt([
                'email' => $validate['email'],
                'password' => $validate['password'],
            ])
        ) {
            RateLimiter::clear($this->throttleKey($request)); // reset attempts
            $seller = auth('seller')->user();

            AdminLog::create([
                'actor_type' => Seller::class,
                'actor_id' => $seller->id,
                'name' => $seller->name,
                'activity' => 'Logged in',
            ]);
            return redirect()->intended(route('seller.dashboard.index'));
        } else {
            RateLimiter::hit($this->throttleKey($request), 3600); // record a failed attempt, decay = 3600s (1hr)
            Log::info("Owner is not authenticated");

            return back()->withErrors(['email' => 'Invalid credentials']);
        }

    }

    protected function ensureIsNotRateLimited(Request $request)
    {
        if (!RateLimiter::tooManyAttempts($this->throttleKey($request), 5)) { // max 5 attempts
            return;
        }

        $seconds = RateLimiter::availableIn($this->throttleKey($request));
        $minutes = ceil($seconds / 60);

        throw ValidationException::withMessages([
            'email' => "Too many login attempts. Please try again in {$minutes} minute(s).",
        ]);
    }

    protected function throttleKey(Request $request): string
    {
        // Lock based on email + IP combination
        return Str::lower($request->input('email')) . '|' . $request->ip();
    }


    public function destroy(Request $request)
    {
        $seller = auth('seller')->user();
        AdminLog::create([
            'actor_type' => Seller::class,
            'actor_id' => $seller->id,
            'name' => $seller->name,
            'activity' => 'Logged out',
        ]);
        // Log out the seller from the custom 'seller' guard
        Auth::guard('seller')->logout();

        // Invalidate the current session
        $request->session()->invalidate();

        // Regenerate the CSRF token to prevent session fixation
        $request->session()->regenerateToken();
        return redirect()->route('seller.login.index');
    }
}
