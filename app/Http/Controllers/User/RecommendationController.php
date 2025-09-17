<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\{UserOnBoarding, Building, Bed, Room, Rating};

class RecommendationController extends Controller
{
    public function getUserPreferredBuildings()
    {
        // Get unique user bed preferences
        $userPrefs = UserOnBoarding::where('user_id', auth()->id())
            ->pluck('bed_preference')
            ->flatten()
            ->unique()
            ->toArray(); // make sure it’s an array

        $buildings = Building::with([
            'rooms.beds.bookings' => function ($q) {
                $q->where('status', 'ended')
                    ->with(['ratings.user', 'user']);
            },
            'address',
            'seller',
            'features', // eager load features
        ])
            ->select('buildings.*')

            // AVG rating
            ->selectSub(function ($query) {
                $query->from('ratings')
                    ->join('bookings', 'bookings.id', '=', 'ratings.booking_id')
                    ->join('beds', 'beds.id', '=', 'bookings.bookable_id')
                    ->join('rooms', 'rooms.id', '=', 'beds.room_id')
                    ->where('bookings.bookable_type', Bed::class)
                    ->where('bookings.status', 'ended')
                    ->whereColumn('rooms.building_id', 'buildings.id')
                    ->selectRaw('AVG(ratings.stars)');
            }, 'avg_rating')

            // COUNT ratings
            ->selectSub(function ($query) {
                $query->from('ratings')
                    ->join('bookings', 'bookings.id', '=', 'ratings.booking_id')
                    ->join('beds', 'beds.id', '=', 'bookings.bookable_id')
                    ->join('rooms', 'rooms.id', '=', 'beds.room_id')
                    ->where('bookings.bookable_type', Bed::class)
                    ->where('bookings.status', 'ended')
                    ->whereColumn('rooms.building_id', 'buildings.id')
                    ->selectRaw('COUNT(ratings.id)');
            }, 'rating_count')

            // Filter buildings that have features matching user preferences
            ->whereHas('features', function ($q) use ($userPrefs) {
                $q->whereIn('name', $userPrefs)
                    ->where('featureable_type', Building::class);
            })
            ->get()
            ->map(function ($building) {
                // Get 3 user avatars from bookings (not from ratings)
                $userImages = $building->rooms
                    ->flatMap(fn($room) => $room->beds)
                    ->flatMap(fn($bed) => $bed->bookings)
                    ->flatMap(fn($booking) => $booking->ratings)
                    ->map(fn($rating) => [
                        'avatar' => $rating->user->avatar ?? '/profile/default-avatar.png',
                        'name' => $rating->user->name,
                    ])
                    ->unique('name')
                    ->take(3)
                    ->values();

                $building->user_images = $userImages;

                return $building;
            });
        Log::info("Here are the buildings data");
        Log::info($buildings);

        return response()->json([
            'buildings' => $buildings,
        ]);
    }

}
