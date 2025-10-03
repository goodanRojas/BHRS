<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Events\Favorite\FavoriteToggled;
use App\Models\{Favorite, Booking, Bed, Rating, Comment};

class BedController extends Controller
{

  


    public function showBed(Request $request, Bed $bed)
    {
        // Load bed relations
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
            'room.building.address',
            'features',
            'favorites',
            'images' => function ($query) {
                $query->select('id', 'file_path', 'order', 'imageable_id', 'imageable_type');
            },
            'bookings' => function ($query) {
                $query->where('status', 'completed');
            },
        ]);

        $bedId = $bed->id;

        // 1️⃣ Rating stats (avg stars + count)
        $ratingStats = Rating::whereHas('booking', function ($query) use ($bedId) {
            $query->where('bookable_type', Bed::class)
                ->where('bookable_id', $bedId)
                ->where('status', 'ended'); // only completed bookings
        })
            ->selectRaw('AVG(stars) as avg_stars, COUNT(*) as rating_count')
            ->first();

        $avgStars = $ratingStats->avg_stars ?? 0;
        $ratingCount = $ratingStats->rating_count ?? 0;
        // 2️⃣ Individual ratings with user info
        $ratingsWithUser = Rating::whereHas('booking', function ($query) use ($bedId) {
            $query->where('bookable_type', Bed::class)
                ->where('bookable_id', $bedId)
                ->where('status', 'ended');
        })
            ->with('user:id,name,avatar') // user who left the rating
            ->orderBy('created_at', 'desc')
            ->get();
        // 2️⃣ Fetch comments with user info
        $comments = Comment::whereHas('booking', function ($query) use ($bedId) {
            $query->where('bookable_type', Bed::class)
                ->where('bookable_id', $bedId)
                ->where('status', 'ended');
        })
        
            ->with('user:id,name,avatar')
            ->whereNull('deleted_at')
            ->orderBy('created_at', 'desc')
            ->get();

        // 3️⃣ Check if this bed is favorited by the user
        $bed->is_favorite = $request->user()
            ->favorites()
            ->where('favoritable_type', Bed::class)
            ->where('favoritable_id', $bed->id)
            ->exists();

        // 4️⃣ Completed bookings count
        $completedBookings = $bed->bookings()->where('status', 'completed')->count();

        // 5️⃣ Total booking duration in minutes
        $totalBookingDuration = $bed->bookings()
            ->where('status', 'completed')
            ->get()
            ->reduce(function ($carry, $booking) {
                $startDate = \Carbon\Carbon::parse($booking->start_date);
                $endDate = \Carbon\Carbon::parse($booking->end_date);
                return $carry + $endDate->diffInMinutes($startDate);
            }, 0);

        // 6️⃣ Sibling beds in the same room (exclude current bed)
        $siblingBeds = Bed::withCount([
            'bookings as completed_bookings_count' => function ($q) {
                $q->where('status', 'ended');
            }
        ])
            ->where('room_id', $bed->room_id)
            ->where('id', '!=', $bed->id)
            ->get()
            ->map(function ($b) {
                $b->average_rating = Rating::whereHas('booking', function ($query) use ($b) {
                    $query->where('bookable_type', Bed::class)
                        ->where('bookable_id', $b->id)
                        ->where('status', 'ended');
                })
                    ->avg('stars') ?? 0; // directly get average
                return $b;
            });


        // 7️⃣ Check if user can book
        $ableToBook = Booking::whereIn('status', ['approved', 'pending', 'paid', 'completed'])
            ->where('user_id', Auth::id())
            ->count();

        // 8️⃣ Check if this bed is already booked
        $isBooked = Booking::where('bookable_id', $bed->id)
            ->where('bookable_type', Bed::class)
            ->where('status', 'completed')
            ->exists();

        return Inertia::render('Home/Bed', [
            'bed' => $bed,
            'completed_bookings' => $completedBookings,
            'total_booking_duration' => $totalBookingDuration,
            'sibling_beds' => $siblingBeds,
            'able_to_book' => $ableToBook,
            'is_booked' => $isBooked,
            'average_rating' => round($avgStars, 2),
            'rating_count' => $ratingCount,
            'comments' => $comments,
            'ratings' => $ratingsWithUser,
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
