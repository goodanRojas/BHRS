<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Room;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
class RoomController extends Controller
{
    public function showToUserRoom(Room $room)
    {
        $room->load('building', 'beds', 'feedbacks', 'bookings', 'favorites');

        return Inertia::render('Home/Room', [
            'room' => $room,
        ]);
    }

    
    public function showRooms(Request $request)
    {
        $rooms = Room::with(['building', 'feedbacks', 'bookings'])
            ->whereNull('user_id')
            ->paginate(10);

        // Calculate min and max prices
        $minPrice = Room::min('price');
        $maxPrice = Room::max('price');

        // Transform data
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
