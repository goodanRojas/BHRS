<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\{Payment, Building, Room, Bed, Booking};
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class SellerDashboardController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $sellerId = auth()->guard('seller')->user()->id;
        $buildingIds = Building::where('seller_id', $sellerId)->pluck('id');
        $roomIds = Room::whereIn('building_id', $buildingIds)->pluck('id');
        $bedIds = Bed::whereIn('room_id', $roomIds)->pluck('id');

        // Building, Room, Bed Counts
        $buildingCount = $buildingIds->count();
        $roomCount = $roomIds->count();
        $bedCount = $bedIds->count();

        // Total number of bookings (completed, pending, or canceled)
        $totalBookingsCount = Booking::whereIn('bookable_id', $bedIds)
            ->orWhereIn('bookable_id', $roomIds)
            ->count();


        // Average booking length (stay duration)
        $averageStayDuration = Booking::whereIn('bookable_id', $bedIds)
            ->orWhereIn('bookable_id', $roomIds)
            ->avg(DB::raw('DATEDIFF(month_count, start_date)'));

        // Frequency of bookings (how often a user books)
        $bookingFrequency = Booking::select(DB::raw('user_id, count(*) as bookings_count'))
            ->whereIn('bookable_id', $bedIds)
            ->orWhereIn('bookable_id', $roomIds)
            ->groupBy('user_id')
            ->orderByDesc('bookings_count')
            ->get();
        $monthlyOccupancy = Booking::whereIn('bookable_id', $bedIds)
            ->orWhereIn('bookable_id', $roomIds)
            ->where('status', 'completed') // Only count completed bookings
            ->selectRaw('MONTH(start_date) as month, COUNT(*) as booked')
            ->groupByRaw('MONTH(start_date)')
            ->orderBy('month')
            ->get();

        // Get total available rooms/beds
        $totalRoomsAndBeds = $bedCount + $roomCount;

        // Calculate the occupancy rate for each month
        $occupancyData = $monthlyOccupancy->map(function ($item) use ($totalRoomsAndBeds) {
            $occupancyRate = ($item->booked / $totalRoomsAndBeds) * 100;
            return [
                'month' => Carbon::createFromFormat('m', $item->month)->format('F'),
                'occupancyRate' => round($occupancyRate, 2)
            ];
        });

        // Prepare the data for the graph
        $occupancyGraphData = [
            'labels' => $occupancyData->pluck('month'),
            'values' => $occupancyData->pluck('occupancyRate'),
            'title' => 'Occupancy Rate'
        ];


       

        return Inertia::render("Seller/Dashboard", [
            'count' => [
                'buildings' => $buildingCount,
                'rooms' => $roomCount,
                'beds' => $bedCount,
              
                'averageStayDuration' => $averageStayDuration,
                'bookingFrequency' => $bookingFrequency,
            ],
            'occupancyData' => $occupancyGraphData,  // Pass the occupancy data for graph
        ]);
    }
}
