<?php

namespace App\Http\Controllers;

use App\Models\Bed;
use App\Models\Building;
use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Auth;

class HomePageController extends Controller
{
    public function index()
    {
        $beds = Bed::with(['room.building', 'feedbacks', 'bookings'])
            ->paginate(10);
    
        // Calculate min and max prices
        $minPrice = Bed::min('price');
        $maxPrice = Bed::max('price');
    
        // Transform data
        $bedsData = $beds->map(function ($bed) {
            return [
                'id' => $bed->id,
                'name' => $bed->name,
                'image' => $bed->image,
                'price' => $bed->price,
                'sale_price' => $bed->sale_price ?? $bed->price, // Default to price if null
                'room_name' => $bed->room->name ?? null,
                'building_address' => $bed->room->building->address ?? null,
                'is_occupied' => $bed->bookings->whereIn('status', ['approved', 'completed'])->isNotEmpty(),
                'avg_rating' => round($bed->feedbacks->avg('rating'), 1),
            ];
        });
    
        return Inertia::render('Home/Home', [
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

        $bedsQuery = Bed::with(['room.building', 'feedbacks', 'bookings'])->whereNull('user_id');

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
                'average_rating' => $bed->feedbacks->avg('rating') ?? 0,
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


    public function showMap(Request $request)
    {

        $boardingHouses = Building::all(['id', 'name', 'address', 'latitude', 'longitude']);
        return response()->json($boardingHouses);
    }


}
