<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Bed;
use Inertia\Inertia;

class BedController extends Controller
{
    public function showToUserBed(Request $request, Bed $bed)
    {
        $bed->load([
            'room' => function ($query) {
                $query->select('id', 'name', 'building_id'); // Select only the room ID and building ID
            },
            'room.building' => function ($query) {
                $query->select('id', 'name'); // Select only the building ID
            },
            'favorites',
            'feedbacks.user'
        ]);
        $bed->is_favorite = $request->user()->favorites->contains($bed->id);
        $bed->average_rating = round($bed->feedbacks->avg('rating'), 1);

        $completedBookings = $bed->bookings()->where('status', 'completed')->count();
        $totalBookingDuration = $bed->bookings()
        ->where('status', 'completed')
        ->get()
        ->reduce(function ($carry, $booking){
            $startDate = \Carbon\Carbon::parse($booking->start_date);
            $endDate = \Carbon\Carbon::parse($booking->end_date);
            $duration = $endDate->diffInMinutes($endDate);
            return $carry + $duration;
        }, 0 );
        return Inertia::render('Home/Bed', [
            'bed' => $bed,
            'completed_bookings' => $completedBookings,
            'total_booking_duration' => $totalBookingDuration,
        ]);
    }

    public function toggleFavorite(Request $request, Bed $bed)
{
    $user = $request->user(); // Get the authenticated user

    try {
        // Check if the bed is already a favorite for the user
        $isFavorite = $user->favorites()->where('beds.id', $bed->id)->exists();

        if ($isFavorite) {
            // Remove from favorites
            $user->favorites()->detach($bed->id);
            $message = 'Bed removed from favorites.';
        } else {
            // Add to favorites
            $user->favorites()->attach($bed->id);
            $message = 'Bed added to favorites.';
        }

        return response()->json(['message' => $message, 'is_favorite' => !$isFavorite], 200);
    } catch (\Exception $e) {
        return response()->json([
            'message' => 'An error occurred while toggling the favorite status.',
            'error' => $e->getMessage(),
        ], 500);
    }
}

}
