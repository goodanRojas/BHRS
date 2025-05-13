<?php


namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Room;
use App\Models\Bed;
use App\Models\Feedback;
use App\Models\Booking;
use Illuminate\Support\Facades\Auth;
use App\Models\Building;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BuildingController  extends Controller
{

    public function showToUserBuilding(Request $request, Building $building)
    {
        if ($building->id) {
            // Eager load relationships
            $building->load(['rooms' => function($query){
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

            return Inertia::render('Home/Building', [
                'building' => $building,
                'ratingStats' => [
                    'average' => round($averageRating, 2),
                    'total' => $totalFeedbacks,
                ],
                'totalCompletedBookings' => $totalCompletedBookings,
            ]);
        }

        $buildings = Building::with('rooms', 'seller')->get();
        return Inertia::render('Home/Buildings', [
            'initialBuildings' => $buildings,
        ]);
    }

    public function searchBuildings(Request $request)
    {
        $search = $request->query('search');

        $buildings = Building::with('rooms', 'seller')
            ->when($search, fn ($query) =>
                $query->where('name', 'like', '%' . $search . '%')
                ->orWhere('address', 'like', '%' . $search . '%')
            )
            ->get();    

        return response()->json($buildings);
    }
}
