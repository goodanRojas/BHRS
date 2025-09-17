<?php


namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\{Auth, Log};
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\{Building, Bed, Booking, Rating};

class BuildingController extends Controller
{

    public function showBuildings(Request $request)
    {
        $buildings = Building::with([
            'rooms.beds.bookings' => function ($q) {
                $q->where('status', 'ended')
                    ->with(['ratings.user', 'user']); // load booking->ratings and booking->user
            },
            'address',
            'seller'
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

            ->get()
            ->map(function ($building) {
                // Get 3 user avatars from bookings (not from ratings)
                $userImages = $building->rooms
                    ->flatMap(fn($room) => $room->beds)
                    ->flatMap(fn($bed) => $bed->bookings)
                    ->flatMap(fn($booking) => $booking->ratings)
                    ->map(fn($rating) => [
                        'avatar' => $rating->user->avatar
                            ?? '/profile/default-avatar.png', // fallback image
                        'name' => $rating->user->name,
                    ])
                    ->unique('name') // or avatar
                    ->take(3)
                    ->values();


                $building->user_images = $userImages;

                return $building;
            });


        return Inertia::render('Home/Buildings', [
            'initialBuildings' => $buildings->toArray(),
        ]);
    }

    public function searchBuildings(Request $request)
    {
        $search = $request->query('search');
        $keywords = $request->query('keywords', []); // array of selected keywords

        $buildings = Building::with([
            'address',
            'seller',
            'rooms.beds.bookings' => function ($q) {
                $q->where('status', 'ended') // 👈 only ended bookings
                    ->with('ratings.user');
            },
            'features',
        ])
            ->when(
                $search,
                fn($query) =>
                $query->where('name', 'like', '%' . $search . '%')
                    ->orWhereHas('address', function ($q) use ($search) {
                        $q->where('barangay', 'like', "%{$search}%")
                            ->orWhere('municipality', 'like', "%{$search}%")
                            ->orWhere('province', 'like', "%{$search}%");
                    })
            )
            ->when(!empty($keywords), function ($query) use ($keywords) {
                $query->whereHas('features', function ($q) use ($keywords) {
                    $q->whereIn('name', $keywords); // OR logic: building has any selected feature
                });
            })
            ->get()
            ->map(function ($building) {
                // Collect all ratings across rooms → beds → bookings
                $ratingData = $building->rooms
                    ->flatMap->beds
                    ->flatMap->bookings
                    ->flatMap->ratings;

                $building->rating_count = $ratingData->count();
                $building->avg_rating = $ratingData->avg('stars');

                $building->user_images = $ratingData
                    ->map(fn($rating) => [
                        'avatar' => $rating->user->avatar
                            ?? '/profile/default-avatar.png', // fallback image
                        'name' => $rating->user?->name,
                    ])
                    ->unique('avatar')
                    ->take(3)
                    ->values();


                return $building;
            })
            ->values();

        Log::info($buildings);
        return response()->json($buildings);
    }
    public function showBuilding(Request $request, Building $building)
    {
        if ($building->id) {
            // Eager load relationships
            $building->load([
                'rooms' => function ($query) {
                    $query->withCount('beds')
                        ->with([
                            'beds' => function ($bedQuery) {
                                $bedQuery->with([
                                    'bookings' => function ($bookingQuery) {
                                        $bookingQuery->where('status', 'ended')
                                            ->with('ratings.user');
                                    }
                                ]);
                            }
                        ]);
                },
                'seller',
                'address',
                'images',
                'features',
                'rulesAndRegulations',
            ]);

            foreach ($building->rooms as $room) {
                $ratings = collect();

                foreach ($room->beds as $bed) {
                    foreach ($bed->bookings as $booking) {
                        $ratings = $ratings->merge($booking->ratings);
                    }
                }
                $room->rating_count = $ratings->count();
                $room->avg_rating = $ratings->avg('stars');
            }

            $totalBedBookings = Booking::whereHas('bookable.room.building', function ($q) use ($building) {
                $q->where('id', $building->id);
            })
                ->where('bookable_type', Bed::class) // make sure only beds, not other bookables
                ->count();


            $ratingStats = Rating::whereHas('booking.bookable.room.building', function ($query) use ($building) {
                $query->where('id', $building->id);
            })
                ->whereHas('booking', function ($q) {
                    $q->where('status', 'ended'); // only completed bookings
                })
                ->selectRaw('AVG(stars) as avg_rating, COUNT(*) as rating_count')
                ->first();

            $avgRating = $ratingStats->avg_rating ?? 0;
            $ratingCount = $ratingStats->rating_count ?? 0;
            return Inertia::render('Home/Building', [
                'building' => $building,
                'totalCompletedBookings' => $totalBedBookings,
                'ratingCount' => $ratingCount,
                'avgRating' => $avgRating,
            ]);
        }
    }


}
