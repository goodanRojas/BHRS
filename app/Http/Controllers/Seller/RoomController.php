<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Room;
use Illuminate\Support\Facades\Log;
use App\Models\Bed;
use App\Models\Feedback;
use App\Models\Booking;

class RoomController extends Controller
{
    public function showToUserRoom(Room $room)
    {
        $room->load('building', 'beds', 'feedbacks.user', 'bookings', 'favorites');
        $bedAvailability = !$room->beds->contains(function ($bed) {
            return $bed->status === 'active';
        });
        $roomId = $room->id;
        // Get all Bed IDs in those rooms
        $bedIds = Bed::where('room_id', $room->id)->pluck('id');

            // Total Ratings (Average & Count)
            $averageRating = Feedback::where(function ($query) use ( $roomId) {
                $query->where(function ($q) use ($roomId) {
                    $q->where('feedbackable_type', Room::class)
                        ->where('feedbackable_id', $roomId);
                });
            })->avg('rating');

            $totalFeedbacks = Feedback::where(function ($query) use ($roomId) {
                $query->where(function ($q) use ($roomId) {
                    $q->where('feedbackable_type', Room::class)
                        ->where('feedbackable_id', $roomId);
                });
            })->count();

            // Total Completed Bookings
            $totalCompletedBookings = Booking::where('status', 'completed')
                ->where(function ($query) use ($roomId) {
                    $query->where(function ($q) use ($roomId) {
                        $q->where('bookable_type', Room::class)
                            ->where('bookable_id', $roomId);
                    });
                })->count();
            $roomAvailablity = Booking::where('status', 'active')
                ->where(function ($query) use ($roomId) {
                    $query->where(function ($q) use ($roomId) {
                        $q->where('bookable_type', Room::class)
                            ->where('bookable_id', $roomId);
                    });
                })->count();
                
        return Inertia::render('Seller/Room', [
            'room' => $room,
            'ratingStats' => [
                'average' => round($averageRating, 2),
                'total' => $totalFeedbacks,
            ],
            'totalCompletedBookings' => $totalCompletedBookings,
            'roomAvailablity' => $roomAvailablity,
            'bedAvailability' => $bedAvailability,
        ]);
    }


}
