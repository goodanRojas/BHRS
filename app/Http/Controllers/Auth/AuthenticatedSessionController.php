<?php

namespace App\Http\Controllers\Auth;

use App\Events\UserStatusUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\{AdminLog, User};
use Illuminate\Validation\ValidationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Inertia\Response;

class AuthenticatedSessionController extends Controller
{
    /**
     * Display the login view.
     */
    public function create(): Response
    {
        return Inertia::render('Auth/Login', [
            'canResetPassword' => Route::has('password.request'),
            'status' => session('status'),
        ]);
    }

    /**
     * Handle an incoming authentication request.
     */
    public function store(Request $request): RedirectResponse
    {
        // Validate input
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);


        // Attempt login
        if (!Auth::attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            throw ValidationException::withMessages([
                'email' => __('auth.failed'), // Invalid credentials
            ]);
        }
        $user = Auth::user();

        if ($user->status != 1) {
            Auth::logout();
            throw ValidationException::withMessages([
                'email' => 'Your account has been restricted. Please contact support.',
            ]);
        }

        // Regenerate session
        $request->session()->regenerate();
        // Set user online status
        $user->update(['is_online' => true]);
        event(new UserStatusUpdated($user->id, true));

        AdminLog::create([
            'actor_type' => User::class,
            'actor_id' => $user->id,
            'name' => $user->name,
            'activity' => 'Logged in',
        ]);

        // Redirect to intended page
        return redirect()->intended(route('to.user.buildings', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        auth()->user()->update(['is_online' => false]);

        AdminLog::create([
            'actor_type' => User::class,
            'actor_id' => auth()->user()->id,
            'name' => auth()->user()->name,
            'activity' => 'Logged out',
        ]);
        event(new UserStatusUpdated(auth()->user()->id, False));
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();


        return redirect('/');
    }
}
