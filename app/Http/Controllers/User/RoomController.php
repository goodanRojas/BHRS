<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\{Room, Rating, Bed, Booking};

class RoomController extends Controller
{
    public function showToUserRoom(Room $room)
    {
        $room->load([
            'building',
            'images',
            'beds.bookings' => function ($query) {
                $query->where('status', 'completed');
            },
            'bookings',
            'favorites'
        ]);

        $roomId = $room->id;

        // Get all bed IDs in this room
        $bedIds = Bed::where('room_id', $roomId)->pluck('id');

        // Get ratings for bookings of those beds
        $ratingStats = Rating::whereHas('booking', function ($q) use ($bedIds) {
            $q->where('bookable_type', Bed::class)
                ->whereIn('bookable_id', $bedIds)
                ->where('status', 'ended'); // only completed bookings
        })
            ->selectRaw('AVG(stars) as avg_rating, COUNT(*) as rating_count')
            ->first();

        // Access values
        $avgRating = $ratingStats->avg_rating ?? 0;
        $ratingCount = $ratingStats->rating_count ?? 0;
        // Total Completed Bookings for beds in this room
        $totalCompletedBookings = Booking::where('status', 'ended')
            ->where('bookable_type', Bed::class)
            ->whereIn('bookable_id', $bedIds)
            ->count();
        return Inertia::render('Home/Room', [
            'room' => $room,
            'totalCompletedBookings' => $totalCompletedBookings,
            'avgRating' => $avgRating,
            'ratingCount' => $ratingCount,
        ]);
    }


    public function showRooms(Request $request)
    {
        $rooms = Room::with(['building', 'bookings'])
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

        $roomsQuery = Room::with(['room.building', 'bookings'])->whereNull('user_id');

        if (!empty($search)) {
            $roomsQuery->where('name', 'like', '%' . $search . '%');
        }

        if (!empty($minPrice) || !empty($maxPrice)) {
            $roomsQuery->whereBetween('price', [$minPrice ?? 0, $maxPrice ?? PHP_INT_MAX]);
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
