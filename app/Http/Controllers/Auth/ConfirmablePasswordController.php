<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class ConfirmablePasswordController extends Controller
{
    /**
     * Show the confirm password view.
     */
    public function show(): Response
    {
        return Inertia::render('Auth/ConfirmPassword');
    }

    /**
     * Confirm the user's password.
     */
    public function store(Request $request): RedirectResponse
    {
        $credentials = $request->only('email', 'password');

        // Attempt login
        if (!Auth::attempt($credentials)) {
            throw ValidationException::withMessages([
                'password' => __('auth.password'), // Shows "incorrect password" message
            ]);
        }

        // Mark password as confirmed in session if needed
        $request->session()->put('auth.password_confirmed_at', time());



        return redirect()->intended(route('to.user.buildings', absolute: false));
    }
}
