<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Services\Recommendation\RecommendationService;
use App\Models\{UserOnBoarding, Building, Bed, Room, Rating};

class RecommendationController extends Controller
{
    /*  public function getUserPreferredBuildings()
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
         Log::info($buildings);

         return response()->json([
             'buildings' => $buildings,
         ]);
     }
  */
    public function getUserPreferredBuildings()
    {
        $userId = auth()->id();

        // 1. Use your new KNN service (returns building IDs sorted by similarity)
        $recommendations = app(RecommendationService::class)
            ->recommendForUser($userId);

        // Extract building IDs in sorted order
        $buildingIds = collect($recommendations)->pluck('building_id')->toArray();

        if (empty($buildingIds)) {
            return response()->json([
                'buildings' => [],
            ]);
        }

        // 2. Load SAME building structure using your original eager-loading rules
        $buildings = Building::with([
            'rooms.beds.bookings' => function ($q) {
                $q->where('status', 'ended')
                    ->with(['ratings.user', 'user']);
            },
            'address',
            'seller',
            'features'
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

            // Rating count
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

            // 3. Filter by recommended building IDs
            ->whereIn('id', $buildingIds)
            ->get()

            // 4. Add user images AND similarity score
            ->map(function ($building) use ($recommendations) {

                // Attach top 3 user avatars
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

                // Attach similarity score (0–1 float)
                $match = collect($recommendations)
                    ->firstWhere('building_id', $building->id);

                $building->similarity_score = $match['similarity'] ?? 0;

                return $building;
            })

            // 5. Sort Eloquent collection based on similarity (preserve KNN ranking)
            ->sortByDesc('similarity_score')
            ->values();

        return response()->json([
            'buildings' => $buildings,
        ]);
    }

}
