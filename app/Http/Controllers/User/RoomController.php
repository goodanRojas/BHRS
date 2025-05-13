<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Room;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
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
                
        return Inertia::render('Home/Room', [
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

    
    public function showRooms(Request $request)
    {
        $rooms = Room::with(['building', 'feedbacks', 'bookings'])
            ->paginate(10);

        // Calculate min and max prices
        $minPrice = Room::min('price');
        $maxPrice = Room::max(column: 'price');

        // Transform data
        $roomsData = $rooms->map(function ($room) {
            return [
                'id' => $room->id,
                'name' => $room->name,
                'image' => $room->image,
                'price' => $room->price,
                'sale_price' => $room->sale_price,
                'room_name' => $room->name ?? null,
                'building_name' => $room->building->name ?? null,
                'building_address' => $room->building->address ?? null,
                'average_rating' => $room->feedbacks->avg('rating') ?? 0,
                'is_occupied' => $room->bookings->where('status', 'active')->isNotEmpty(),
            ];
        });
        Log::info('Rooms data:', context: $roomsData->toArray());

        return Inertia::render('Home/Rooms', [
            'initialRooms' => [
                'data' => $roomsData,
                'current_page' => $rooms->currentPage(),
                'last_page' => $rooms->lastPage(),
                'has_more_pages' => $rooms->hasMorePages(),
            ],
            'initialPagination' => [
                'current_page' => $rooms->currentPage(),
                'last_page' => $rooms->lastPage(),
                'has_more_pages' => $rooms->hasMorePages(),
            ],
            'isAuthenticated' => Auth::check(),
            'priceRange' => [
                'min' => $minPrice,
                'max' => $maxPrice,
            ],
        ]);
    }

 
    public function showMoreRooms(Request $request)
    {
        $search = $request->input('search');
        $minPrice = $request->input('min_price');
        $maxPrice = $request->input('max_price');
        $minRating = $request->input('min_rating');
        $room = $request->input('room');
        $building = $request->input('building');
        $location = $request->input('location');
        $page = $request->input('page', 1);

        $roomsQuery = Room::with(['room.building', 'feedbacks', 'bookings'])->whereNull('user_id');

        if (!empty($search)) {
            $roomsQuery->where('name', 'like', '%' . $search . '%');
        }

        if (!empty($minPrice) || !empty($maxPrice)) {
            $roomsQuery->whereBetween('price', [$minPrice ?? 0, $maxPrice ?? PHP_INT_MAX]);
        }

        if (!empty($minRating)) {
            $roomsQuery->whereHas('feedbacks', function ($query) use ($minRating) {
                $query->havingRaw('AVG(rating) >= ?', [$minRating]);
            });
        }


        if (!empty($building)) {
            $roomsQuery->whereHas('building', function ($query) use ($building) {
                $query->where('name', $building);
            });
        }

       

        $rooms = $roomsQuery->paginate(10, ['*'], 'page', $page);

        $roomsData = $rooms->getCollection()->map(function ($room) {
            return [
                'id' => $room->id,
                'name' => $room->name,
                'image' => $room->image,
                'price' => $room->price,
                'sale_price' => $room->sale_price,
                'room_name' => $room->room->name ?? null,
                'building_address' => $room->room->building->address ?? null,
                'average_rating' => $room->feedbacks->avg('rating') ?? 0,
                'is_occupied' => $room->bookings->where('status', 'active')->isNotEmpty(),
            ];
        });

        return response()->json([
            'data' => $roomsData,
            'current_page' => $room->currentPage(),
            'last_page' => $room->lastPage(),
            'has_more_pages' => $room->hasMorePages(),
        ]);
    }
}
