<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Bed;
use Illuminate\Http\Request;
use Inertia\Inertia;
class BedController extends Controller
{
   public function showBed(Request $request, Bed $bed)
    {
        $bed->load([
            'room' => function ($query) {
                $query->select('id', 'name', 'building_id');
            },
            'room.building' => function ($query) {
                $query->select('id', 'name', 'address', 'seller_id');
            },
            'room.building.seller' => function ($query) {
                $query->select('id', 'name', 'image');
            },
            'feedbacks.user',
            'images' => function ($query) {
                $query->select('id', 'file_path', 'order', 'imageable_id', 'imageable_type');
            },

        ]);

       
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

        return Inertia::render('Seller/Bed', [
            'bed' => $bed,
            'completed_bookings' => $completedBookings,
            'total_booking_duration' => $totalBookingDuration,
            'sibling_beds' => $siblingBeds,
        ]);
    }

     
}
