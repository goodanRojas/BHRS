<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Models\Building;
use App\Models\Room;
use App\Models\Bed;
use App\Models\Feedback;
use App\Models\Booking;

class BuildingController extends Controller
{
    public function index(Request $request)
    {
        $sellerId = Auth::guard('seller')->id();
        // Fetch all buildings for the seller
        $buildings = Building::with('rooms', 'seller')->where('seller_id', $sellerId)->get();
        return Inertia::render('Seller/Buildings', [
            'initialBuildings' => $buildings,
        ]);
    }
    public function searchBuildings(Request $request)
    {
        $search = $request->query('search');

        $buildings = Building::with('rooms', 'seller')
            ->when(
                $search,
                fn($query) =>
                $query->where(function ($q) use ($search) {
                    $q->where('name', 'like', '%' . $search . '%')
                        ->orWhere('address', 'like', '%' . $search . '%');
                })
            )
            ->where('seller_id', Auth::guard('seller')->id())
            ->get();

        return response()->json($buildings);
    }

    public function showBuilding(Building $building)
    {
        $building->load(['rooms' => function ($query) {
            $query->withCount('beds');
        }, 'seller']);

        // Get all Room IDs in the building
        $roomIds = Room::where('building_id', $building->id)->pluck('id');

        // Get all Bed IDs in those rooms
        $bedIds = Bed::whereIn('room_id', $roomIds)->pluck('id');

        // Total Ratings (Average & Count)
        $averageRating = Feedback::where(function ($query) use ($roomIds, $bedIds) {
            $query->where(function ($q) use ($roomIds) {
                $q->where('feedbackable_type', Room::class)
                    ->whereIn('feedbackable_id', $roomIds);
            })->orWhere(function ($q) use ($bedIds) {
                $q->where('feedbackable_type', Bed::class)
                    ->whereIn('feedbackable_id', $bedIds);
            });
        })->avg('rating');

        $totalFeedbacks = Feedback::where(function ($query) use ($roomIds, $bedIds) {
            $query->where(function ($q) use ($roomIds) {
                $q->where('feedbackable_type', Room::class)
                    ->whereIn('feedbackable_id', $roomIds);
            })->orWhere(function ($q) use ($bedIds) {
                $q->where('feedbackable_type', Bed::class)
                    ->whereIn('feedbackable_id', $bedIds);
            });
        })->count();

        // Total Completed Bookings
        $totalCompletedBookings = Booking::where('status', 'completed')
            ->where(function ($query) use ($roomIds, $bedIds) {
                $query->where(function ($q) use ($roomIds) {
                    $q->where('bookable_type', Room::class)
                        ->whereIn('bookable_id', $roomIds);
                })->orWhere(function ($q) use ($bedIds) {
                    $q->where('bookable_type', Bed::class)
                        ->whereIn('bookable_id', $bedIds);
                });
            })->count();

        return Inertia::render('Seller/Building', [
            'building' => $building,
            'ratingStats' => [
                'average' => round($averageRating, 2),
                'total' => $totalFeedbacks,
            ],
            'totalCompletedBookings' => $totalCompletedBookings,
        ]);
    }
}
