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

    public function showBuildings(Request $request, Building $building)
    {
        $buildings = Building::with([
            'rooms.beds.bookings' => function ($q) {
                $q->where('status', 'completed')
                    ->with('user'); // eager load the user who booked
            },
            'rooms.beds.bookings.ratings',
            'address',
            'seller'
        ])
            ->select('buildings.*')
            ->selectSub(function ($query) {
                $query->from('ratings')
                    ->join('bookings', 'bookings.id', '=', 'ratings.booking_id')
                    ->join('beds', 'beds.id', '=', 'bookings.bookable_id')
                    ->join('rooms', 'rooms.id', '=', 'beds.room_id')
                    ->where('bookings.bookable_type', Bed::class)
                    ->whereColumn('rooms.building_id', 'buildings.id')
                    ->selectRaw('AVG(ratings.stars)');
            }, 'avg_stars')
            ->get();



        return Inertia::render('Home/Buildings', [
            'initialBuildings' => $buildings->toArray(),
        ]);
    }
    public function showBuilding(Request $request, Building $building)
    {
        if ($building->id) {
            // Eager load relationships
            $building->load(['rooms' => function ($query) {
                $query->withCount('beds');
            }, 'seller', 'address']);

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
    }

    public function searchBuildings(Request $request)
    {
        $search = $request->query('search');

        $buildings = Building::with('rooms', 'address', 'seller')
            ->when(
                $search,
                fn($query) =>
                $query->where('name', 'like', '%' . $search . '%')
                    ->orWhere('address', 'like', '%' . $search . '%')
            )
            ->get();

        return response()->json($buildings);
    }
}
