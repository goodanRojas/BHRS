<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Favorite;
use App\Events\Favorite\FavoriteToggled;
use App\Models\Bed;

class BedController extends Controller
{

    public function index()
    {
        $beds = Bed::with(['room.building', 'feedbacks', 'bookings', 'features'])
            ->paginate(10);
        Log::info($beds->getCollection());
        // Calculate min and max prices
        $minPrice = Bed::min('price');
        $maxPrice = Bed::max('price');

        // Transform data
        $bedsData = $beds->getCollection()->map(function ($bed) {
            return [
                'id' => $bed->id,
                'name' => $bed->name,
                'image' => $bed->image,
                'price' => $bed->price,
                'sale_price' => $bed->sale_price ?? $bed->price, // Default to price if null
                'room_name' => $bed->room->name ?? null,
                'is_favorite' =>  $bed
                    ->favorites
                    ->where('favoritable_type', Bed::class)
                    ->where('favoritable_id', $bed->id)
                    ->isNotEmpty(),
                'building_address' => $bed->room->building->address ?? null,
                'is_occupied' => $bed->bookings->whereIn('status', ['approved', 'completed'])->isNotEmpty(),
                'avg_rating' => round($bed->feedbacks->avg('rating'), 1),
                ''
            ];
        });

        return Inertia::render('Home/Beds', [
            'initialBeds' => [
                'data' => $bedsData,
                'current_page' => $beds->currentPage(),
                'last_page' => $beds->lastPage(),
                'has_more_pages' => $beds->hasMorePages(),
            ],
            'initialPagination' => [
                'current_page' => $beds->currentPage(),
                'last_page' => $beds->lastPage(),
                'has_more_pages' => $beds->hasMorePages(),
            ],
            'isAuthenticated' => Auth::check(),
            'priceRange' => [
                'min' => $minPrice,
                'max' => $maxPrice,
            ],
        ]);
    }


    // Returns filtered or initial data
    public function show(Request $request)
    {
        $search = $request->input('search');
        $minPrice = $request->input('min_price');
        $maxPrice = $request->input('max_price');
        $minRating = $request->input('min_rating');
        $room = $request->input('room');
        $building = $request->input('building');
        $location = $request->input('location');
        $page = $request->input('page', 1);

        $bedsQuery = Bed::with(['room.building', 'feedbacks', 'bookings'])
            ->whereDoesntHave('bookings', function ($query) {
                $query->whereIn('status', ['approved', 'completed']);
            });

        if (!empty($search)) {
            $bedsQuery->where('name', 'like', '%' . $search . '%');
        }

        if (!empty($minPrice) || !empty($maxPrice)) {
            $bedsQuery->whereBetween('price', [$minPrice ?? 0, $maxPrice ?? PHP_INT_MAX]);
        }

        if (!empty($minRating)) {
            $bedsQuery->whereHas('feedbacks', function ($query) use ($minRating) {
                $query->havingRaw('AVG(rating) >= ?', [$minRating]);
            });
        }

        if (!empty($room)) {
            $bedsQuery->whereHas('room', function ($query) use ($room) {
                $query->where('name', $room);
            });
        }

        if (!empty($building)) {
            $bedsQuery->whereHas('room.building', function ($query) use ($building) {
                $query->where('name', $building);
            });
        }

        if (!empty($location)) {
            $bedsQuery->whereHas('room.building', function ($query) use ($location) {
                $query->where('address', 'like', '%' . $location . '%');
            });
        }

        $beds = $bedsQuery->paginate(10, ['*'], 'page', $page);

        $bedsData = $beds->getCollection()->map(function ($bed) {
            return [
                'id' => $bed->id,
                'name' => $bed->name,
                'image' => $bed->image,
                'price' => $bed->price,
                'sale_price' => $bed->sale_price,
                'room_name' => $bed->room->name ?? null,
                'building_address' => $bed->room->building->address ?? null,
                'avg_rating' => round($bed->feedbacks->avg('rating') ?? 0, 1),
                'is_occupied' => $bed->bookings->where('status', 'active')->isNotEmpty(),
            ];
        });

        return response()->json([
            'data' => $bedsData,
            'current_page' => $beds->currentPage(),
            'last_page' => $beds->lastPage(),
            'has_more_pages' => $beds->hasMorePages(),
        ]);
    }



    public function showBed(Request $request, Bed $bed)
    {
        $bed->load([
            'room' => function ($query) {
                $query->select('id', 'name', 'building_id');
            },
            'room.building' => function ($query) {
                $query->select('id', 'name', 'seller_id');
            },
            'room.building.seller' => function ($query) {
                $query->select('id', 'name', 'avatar');
            },
            'features',
            'room.building.address',
            'favorites',
            'feedbacks' => function ($query) {
                $query->orderBy('created_at', 'desc');
            } ,
            'feedbacks.user',
            'images' => function ($query) {
                $query->select('id', 'file_path', 'order', 'imageable_id', 'imageable_type');
            },

        ]);

        // Check if this bed is favorited by the user
        $bed->is_favorite = $request->user()
            ->favorites()
            ->where('favoritable_type', Bed::class)
            ->where('favoritable_id', $bed->id)
            ->exists();

        // Calculate average rating
        $bed->average_rating = round($bed->feedbacks->avg('rating'), 1);

        // Count completed bookings
        $completedBookings = $bed->bookings()->where('status', 'completed')->count();

        // Sum of booking durations (in minutes)
        $totalBookingDuration = $bed->bookings()
            ->where('status', 'completed')
            ->get()
            ->reduce(function ($carry, $booking) {
                $startDate = \Carbon\Carbon::parse($booking->start_date);
                $endDate = \Carbon\Carbon::parse($booking->end_date);
                $duration = $endDate->diffInMinutes($startDate); // corrected here!
                return $carry + $duration;
            }, 0);

        // 🎯 Get sibling beds (in the same room, but exclude current bed)
        $siblingBeds = Bed::withCount(['bookings' => function ($q) {
            $q->where('status', 'completed');
        }])
            ->with('feedbacks') // Optional: include ratings
            ->where('room_id', $bed->room_id)
            ->where('id', '!=', $bed->id)
            ->get()
            ->map(function ($sibling) {
                $sibling->average_rating = round($sibling->feedbacks->avg('rating'), 1);
                return $sibling;
            });

        return Inertia::render('Home/Bed', [
            'bed' => $bed,
            'completed_bookings' => $completedBookings,
            'total_booking_duration' => $totalBookingDuration,
            'sibling_beds' => $siblingBeds,
        ]);
    }


    public function toggleFavoriteBed(Request $request, Bed $bed)
    {
        $user = $request->user();

        try {
            // Check if already favorited
            $favorite = Favorite::where('user_id', $user->id)
                ->where('favoritable_type', Bed::class)
                ->where('favoritable_id', $bed->id)
                ->first();

            if ($favorite) {
                $favorite->delete();
                $message = 'Bed removed from favorites.';
                $isFavorite = false;
            } else {
                Favorite::create([
                    'user_id' => $user->id,
                    'favoritable_type' => Bed::class,
                    'favoritable_id' => $bed->id,
                ]);
                $message = 'Bed added to favorites.';
                $isFavorite = true;
            }
            $favoriteCount = Favorite::where('user_id', $user->id)
                ->where('favoritable_type', Bed::class)
                ->count();


            Log::info('User ' . $user->id . ' toggled favorite status for bed ' . $bed->id . '. New count: ' . $favoriteCount);
            broadcast(new FavoriteToggled($favoriteCount, auth()->id()));
            Log::info('Broadcasted favorite toggled event for user ' . auth()->id() . ' with count: ' . $favoriteCount);

            return response()->json([
                'message' => $message,
                'is_favorite' => $isFavorite,
                'favorites_count' => auth()->user()->favorites()->count()
            ], 200);
        } catch (\Exception $e) {
            Log::error('Error toggling favorite status: ' . $e->getMessage());

            return response()->json([
                'message' => 'An error occurred while toggling the favorite status.',
                'error' => $e->getMessage(),
            ], 500);
        }
    }
}
