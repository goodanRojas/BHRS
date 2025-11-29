<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\{User, Building, Booking, Bed, Admin, AdminLog};
use Illuminate\Support\Facades\{Hash, Log};
class UserController extends Controller
{
    public function index()
    {
        $users = User::orderBy('created_at', 'desc')->paginate(10);
        return Inertia::render('Admin/Users/Users', [
            'users' => $users,
        ]);
    }

    public function create(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
        ]);
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'email_verified_at' => now(),
        ]);

        AdminLog::create([
            'actor_type' => Admin::class,
            'actor_id' => auth()->guard('admin')->id(),
            'name' => auth()->guard('admin')->user()->name,
            'activity' => 'Created user account: ' . $user->name,
        ]);

        return redirect()->back()->with('success', 'User created successfully');
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'password' => 'required|min:8',
        ]);
        $user = User::findOrFail($id);
        $user->update([
            'name' => $request->name,
            'password' => Hash::make($request->password),
        ]);

        AdminLog::create([
            'actor_type' => Admin::class,
            'actor_id' => auth()->guard('admin')->id(),
            'name' => auth()->guard('admin')->user()->name,
            'activity' => 'Updated user account: ' . $user->name,
        ]);
        return redirect()->back()->with('success', 'User updated successfully');
    }

    public function toggleStatus($id)
    {
        $user = User::findOrFail($id); // Assuming you're using the `User` model, not `Seller`
        $user->status = !$user->status;
        $user->save();

        AdminLog::create([
            'actor_type' => Admin::class,
            'actor_id' => auth()->guard('admin')->id(),
            'name' => auth()->guard('admin')->user()->name,
            'activity' => ($user->status ? 'Activated' : 'Deactivated') . ' user account: ' . $user->name,
        ]);

        return response()->json([
            'success' => true,
        ]);
    }

    public function show($id)
    {
        $user = User::findOrFail($id);
        return inertia("Admin/Users/User", [
            'user' => $user,
        ]);
    }

    public function buildings()
    {
        $buildings = Building::select(['id', 'name', 'image', 'seller_id'])
            ->with([
                'seller:id,name,avatar',
                'rooms' => function ($query) {
                    $query->select(['id', 'building_id', 'name', 'image'])
                        ->with([
                            'beds' => function ($q) {
                                $q->select(['id', 'room_id', 'name', 'image']);
                            }
                        ]);
                }
            ])->get();

        return response()->json($buildings);
    }

    public function bookings($userId, $bedId)
    {
        $bookings = Booking::with('comments')
            ->withAvg('ratings', 'stars')
            ->where('user_id', $userId)
            // ->where('status', 'ended')
            ->where('bookable_type', Bed::class)
            ->where('bookable_id', $bedId)
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($bookings);
    }

    public function addBooking(Request $request)
    {
        Log::info($request->all());
        $validated = $request->validate([
            'userId' => 'required|integer|exists:users,id',
            'bedId' => 'required|integer|exists:beds,id',
            'startDate' => 'required|date|', //after_or_equal:today
            'monthCount' => 'required|integer|min:1',
            //     'address.region' => 'required|string|max:255',
            //     'address.province' => 'required|string|max:255',
            //     'address.municipality' => 'required|string|max:255',
            //     'address.barangay' => 'required|string|max:255',
        ]);

        $booking = Booking::create([
            'user_id' => $validated['userId'],
            'bookable_id' => $validated['bedId'],
            'bookable_type' => Bed::class,
            'start_date' => $validated['startDate'],
            'month_count' => $validated['monthCount'],
            'total_price' => 0,
            'special_request' => false,
            'agreed_to_terms' => true,
            'status' => 'completed',
            'payment_method' => 'cash',
        ]);

        AdminLog::create([
            'actor_type' => Admin::class,
            'actor_id' => auth()->guard('admin')->id(),
            'name' => auth()->guard('admin')->user()->name,
            'activity' => 'Added booking ID: ' . $booking->id . ' for user ID: ' . $validated['userId'],
        ]);

        return response()->json([
            'success' => true,
            'booking' => $booking,
        ]);
    }
}
