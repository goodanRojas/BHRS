<?php

namespace App\Http\Controllers\Admin\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Log, Auth, RateLimiter, };
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use App\Models\{Admin, AdminLog};
class AuthenticatedSessionController extends Controller
{
    public function create(Request $request)
    {
        return Inertia::render('Admin/Login');
    }

    public function store(Request $request)
    {
        $this->ensureIsNotRateLimited($request);

        $validate = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (
            Auth::guard('admin')->attempt([
                'email' => $validate['email'],
                'password' => $validate['password'],
            ])
        ) {
            RateLimiter::clear($this->throttleKey($request)); // reset attempts
            $admin = Auth::guard('admin')->user();
            AdminLog::create([
                'actor_type' => Admin::class,
                'actor_id' => $admin->id,
                'name' => $admin->name,
                'activity' => 'Admin Logged In',
                ,
            ]);
            return redirect()->intended(route('admin.dashboard'));
        } else {
            RateLimiter::hit($this->throttleKey($request), 3600); // record a failed attempt, decay = 3600s (1hr)
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


    public function logout(Request $request)
    {
        $admin = Auth::guard('admin')->user();
        AdminLog::create([
            'actor_type' => Admin::class,
            'actor_id' => $admin->id,
            'name' => $admin->name,
            'activity' => 'Admin Logged Out',
            ,
        ]);
        auth('admin')->logout();
        return redirect()->route('admin.login');
    }

}
