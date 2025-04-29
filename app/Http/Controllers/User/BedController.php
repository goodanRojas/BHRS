<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\Favorite;

use App\Models\Bed;

class BedController extends Controller
{
    public function showToUserBed(Request $request, Bed $bed)
    {
        $bed->load([
            'room' => function ($query) {
                $query->select('id', 'name', 'building_id');
            },
            'room.building' => function ($query) {
                $query->select('id', 'name');
            },
            'favorites',
            'feedbacks.user'
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

            return response()->json(['message' => $message, 'is_favorite' => $isFavorite,
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
