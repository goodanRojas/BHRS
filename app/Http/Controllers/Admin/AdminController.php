<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
class AdminController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Admin/Login');
    }

    public function store(Request $request)
    {
        $validate = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        if (Auth::guard('admin')->attempt(['email' => $validate['email'], 'password' => $validate['password']])) {
            Log::info("Admin Is authenticated! ");
            return redirect()->intended(route('admin.dashboard', absolute: false));
        } else {
            Log::info("Admin is not authenticated");
            return back()->with('error', 'Invalid Credentials');
        }
    }
    public function dashboard(Request $request)
    {
        return Inertia::render('Admin/Dashboard');
    }

    public function logout(Request $request)
    {
        auth('admin')->logout();
        return redirect()->route('admin.login.index');
    }
}
