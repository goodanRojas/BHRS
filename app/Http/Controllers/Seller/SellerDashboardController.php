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

        // Completed bookings count (for revenue)
        $payedBookingsCount = Payment::where('status', 'completed')
            ->whereIn('booking_id', function ($query) use ($bedIds, $roomIds) {
                $query->select('id')
                    ->from('bookings')
                    ->where(function ($q) use ($bedIds, $roomIds) {
                        $q->whereIn('bookable_id', $bedIds)
                            ->where('bookable_type', Bed::class)
                            ->orWhereIn('bookable_id', $roomIds)
                            ->where('bookable_type', Room::class);
                    });
            })->count();

        // Calculate occupancy rate (percentage of booked rooms/beds)
        $totalBedsAndRooms = $bedCount + $roomCount;
        $occupancyRate = $totalBedsAndRooms ? ($payedBookingsCount / $totalBedsAndRooms) * 100 : 0;

        // Total revenue (sum of payments for completed bookings)
        $totalRevenue = Payment::where('status', 'completed')
            ->whereIn('booking_id', function ($query) use ($bedIds, $roomIds) {
                $query->select('id')
                    ->from('bookings')
                    ->where(function ($q) use ($bedIds, $roomIds) {
                        $q->whereIn('bookable_id', $bedIds)
                            ->where('bookable_type', Bed::class)
                            ->orWhereIn('bookable_id', $roomIds)
                            ->where('bookable_type', Room::class);
                    });
            })->sum('amount');

        // Average booking length (stay duration)
        $averageStayDuration = Booking::whereIn('bookable_id', $bedIds)
            ->orWhereIn('bookable_id', $roomIds)
            ->avg(DB::raw('DATEDIFF(end_date, start_date)'));

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

        $monthlyRevenue = Payment::where('status', 'completed')
            ->whereIn('booking_id', function ($query) use ($bedIds, $roomIds) {
                $query->select('id')
                    ->from('bookings')
                    ->where(function ($q) use ($bedIds, $roomIds) {
                        $q->whereIn('bookable_id', $bedIds)
                            ->where('bookable_type', Bed::class)
                            ->orWhereIn('bookable_id', $roomIds)
                            ->where('bookable_type', Room::class);
                    });
            })
            ->selectRaw('MONTH(created_at) as month, SUM(amount) as total_revenue')
            ->groupByRaw('MONTH(created_at)')
            ->orderBy('month')
            ->get();

        // Format the data for the graph
        $revenueData = [
            'labels' => $monthlyRevenue->map(function ($item) {
                return Carbon::createFromFormat('m', $item->month)->format('F'); // Convert to month names (e.g., January)
            }),
            'values' => $monthlyRevenue->pluck('total_revenue'),
            'title' => 'Total Revenue',
        ];


        return Inertia::render("Seller/Dashboard", [
            'count' => [
                'buildings' => $buildingCount,
                'rooms' => $roomCount,
                'beds' => $bedCount,
                'payedBookingsCount' => $payedBookingsCount,
                'occupancyRate' => $occupancyRate,
                'totalRevenue' => $totalRevenue,
                'averageStayDuration' => $averageStayDuration,
                'bookingFrequency' => $bookingFrequency,
            ],
            'revenueData' => $revenueData,  // Pass the revenue data for graph
            'occupancyData' => $occupancyGraphData,  // Pass the occupancy data for graph
        ]);
    }
}
