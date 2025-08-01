<?php

namespace App\Http\Controllers\Auth;

use App\Events\UserStatusUpdated;
use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
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
    public function store(LoginRequest $request): RedirectResponse
    {
        $request->authenticate();

        $request->session()->regenerate();

        auth()->user()->update(['is_online' => true]);
        event(new UserStatusUpdated(auth()->user()->id, true));

        return redirect()->intended(route('home', absolute: false));
    }

    /**
     * Destroy an authenticated session.
     */
    public function destroy(Request $request): RedirectResponse
    {
        auth()->user()->update(['is_online' => false]);
        event(new UserStatusUpdated(auth()->user()->id, False));
        Auth::guard('web')->logout();

        $request->session()->invalidate();

        $request->session()->regenerateToken();



        return redirect('/');
    }
}
