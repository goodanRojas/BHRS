<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\{Building, RouteDestination};
use Illuminate\Support\Facades\Log;

class MapController extends Controller
{
    public function index($buildingId = null)
    {
        $boardingHouses = Building::with([
            'seller',
            'routes',
            'address',
            'rooms.beds.bookings.ratings',
            'rooms.beds.bookings.user:id,name,avatar',
        ])->get();

        foreach ($boardingHouses as $building) {
            // collect all ratings for ALL beds in this building
            $ratings = collect();
            foreach ($building->rooms as $room) {
                foreach ($room->beds as $bed) {
                    foreach ($bed->bookings as $booking) {
                        $ratings = $ratings->merge($booking->ratings);
                    }
                }
            }

            // building-level stats
            $building->rating_count = $ratings->count();
            $building->avg_rating = $ratings->avg('stars');

            // top 3 newest raters
            $newestRatings = $ratings
                ->sortByDesc('created_at')
                ->take(3);

            $building->newest_raters = $newestRatings->map(function ($rating) {
                return [
                    'id' => $rating->booking->user->id,
                    'name' => $rating->booking->user->name,
                    'avatar' => $rating->booking->user->avatar,
                    'rated_at' => $rating->created_at,
                ];
            })->values()->toArray();

            // remaining count of raters (after top 3)
            $building->remaining_raters_count = max($ratings->count() - 3, 0);
        }

        $destinations = RouteDestination::all();

        return Inertia::render('Map/MapBox', [
            'buildings' => $boardingHouses,
            'destinations' => $destinations,
            'focusId' => $buildingId
        ]);
    }


}
