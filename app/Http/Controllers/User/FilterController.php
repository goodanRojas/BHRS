<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\{Building, Bed};
class FilterController extends Controller
{

    public function applyFilter(Request $request)
    {
        $buildings = Building::with([
            'rooms.beds.bookings' => function ($q) {
                $q->where('status', 'ended')
                    ->with(['ratings.user', 'user']);
            },
            'address',
            'seller',
        ])
            ->select('buildings.*')
            ->withCount('buildingViewCount')

            // Average rating
            ->selectSub(function ($query) {
                $query->from('ratings')
                    ->join('bookings', 'bookings.id', '=', 'ratings.booking_id')
                    ->join('beds', 'beds.id', '=', 'bookings.bookable_id')
                    ->join('rooms', 'rooms.id', '=', 'beds.room_id')
                    ->where('bookings.bookable_type', Bed::class)
                    ->where('bookings.status', 'ended')
                    ->whereColumn('rooms.building_id', 'buildings.id')
                    ->selectRaw('AVG(ratings.stars)');
            }, 'avg_rating')

            // Rating count
            ->selectSub(function ($query) {
                $query->from('ratings')
                    ->join('bookings', 'bookings.id', '=', 'ratings.booking_id')
                    ->join('beds', 'beds.id', '=', 'bookings.bookable_id')
                    ->join('rooms', 'rooms.id', '=', 'beds.room_id')
                    ->where('bookings.bookable_type', Bed::class)
                    ->where('bookings.status', 'ended')
                    ->whereColumn('rooms.building_id', 'buildings.id')
                    ->selectRaw('COUNT(ratings.id)');
            }, 'rating_count')

            ->where('status', 'active')

            // 🏠 Filter by Bed price
            ->when(data_get($request, 'payload.price'), function ($query, $price) {
                $query->whereHas('rooms.beds', function ($q) use ($price) {
                    $q->where('price', '<=', $price);
                });
            })

            ->when(data_get($request, 'payload.rating'), function ($query, $rating) {
                $query->having('avg_rating', '>=', $rating);
            })

            ->when(data_get($request, 'payload.address'), function ($query, $addressFilters) {
                $query->whereHas('address', function ($q) use ($addressFilters) {
                    foreach ($addressFilters as $key => $value) {
                        if (!empty($value)) {
                            // For JSON column search (MySQL 8+)
                            $q->where("address->{$key}", 'LIKE', "%{$value}%");
                        }
                    }
                });
            })
            ->get();

        return response()->json($buildings);
    }

}