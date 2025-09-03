<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Log, Hash, Auth};
use Carbon\Carbon;
use App\Models\{Admin};
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
            return redirect()->intended(route('admin.dashboard'));
        } else {
            Log::info("Admin is not authenticated");
            return back()->withErrors(['email' => 'Invalid Credentials']);
        }
    }
    public function dashboard(Request $request)
    {

        return Inertia::render('Admin/Dashboard', [
            'stats' => [
                ['title' => 'Users', 'value' => 1253],
                ['title' => 'Owners', 'value' => 97],
                ['title' => 'Properties', 'value' => 143],
                ['title' => 'Beds', 'value' => 2154],
                ['title' => 'Bookings', 'value' => 432],
                ['title' => 'Earnings (₱)', 'value' => '₱185,450'],
            ],
            'earningsData' => collect(range(1, 6))->map(fn($m) => [
                'month' => Carbon::now()->subMonths(6 - $m)->format('M'),
                'amount' => rand(20000, 50000),
            ]),
            'bookingsData' => collect(range(1, 6))->map(fn($m) => [
                'month' => Carbon::now()->subMonths(6 - $m)->format('M'),
                'count' => rand(50, 150),
            ]),
            'bookingsTable' => [
                ['user' => 'Jen D.', 'property' => 'Tan Hall', 'status' => 'Confirmed'],
                ['user' => 'Paul R.', 'property' => 'Gomez Inn', 'status' => 'Pending'],
            ],
            'usersTable' => [
                ['name' => 'Carlo Reyes', 'email' => 'carlo@email.com', 'joined' => 'Jul 17'],
                ['name' => 'Angela Cruz', 'email' => 'angela@email.com', 'joined' => 'Jul 16'],
            ],
        ]);
    }

    public function logout(Request $request)
    {
        auth('admin')->logout();
        return redirect()->route('admin.login');
    }
}
