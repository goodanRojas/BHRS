<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Log, Hash, Auth, DB};
use Carbon\Carbon;
use App\Models\{Admin, Booking, Building, Bed, Room, Feature, Receipt, Seller, Cancel, Rating, Comment, User};
class AdminController extends Controller
{
    public function dashboard(Request $request)
    {
        // ✅ Stats
        $stats = [
            'users' => User::count(),
            'sellers' => Seller::count(),
            'buildings' => Building::count(),
            'rooms' => Room::count(),
            'beds' => Bed::count(),
            'bookings' => Booking::count(),
            'earnings' => Receipt::sum('amount'),
        ];

        // Occupancy rate
        $totalBeds = Bed::count();
        $occupiedBeds = Booking::where('status', 'confirmed')
            ->distinct('bookable_id')
            ->count('bookable_id');
        $stats['occupancyRate'] = $totalBeds > 0
            ? round(($occupiedBeds / $totalBeds) * 100, 2)
            : 0;

        // ✅ Charts
        $monthlyEarnings = Receipt::selectRaw('MONTH(paid_at) as month, SUM(amount) as earnings')
            ->groupBy('month')
            ->get();

        $monthlyBookings = Booking::selectRaw('MONTH(start_date) as month, COUNT(*) as total')
            ->groupBy('month')
            ->get();

        $ratings = Rating::selectRaw('stars, COUNT(*) as total')
            ->groupBy('stars')
            ->get();

        $cancels = Cancel::selectRaw('MONTH(created_at) as month, COUNT(*) as total')
            ->groupBy('month')
            ->get();

        $topFeatures = DB::table('features')
            ->select('features.name', DB::raw('COUNT(bookings.id) as bookings_count'))
            ->join('bookings', function ($join) {
                $join->on('bookings.bookable_id', '=', 'features.featureable_id')
                    ->whereColumn('bookings.bookable_type', 'features.featureable_type');
            })
            ->groupBy('features.name')
            ->orderByDesc('bookings_count')
            ->limit(5)
            ->get();
        // Most booked buildings

        $topBuildings = DB::table('buildings')
            ->join('rooms', 'rooms.building_id', '=', 'buildings.id')
            ->join('beds', 'beds.room_id', '=', 'rooms.id')
            ->join('bookings', function ($join) {
                $join->on('bookings.bookable_id', '=', 'beds.id')
                    ->where('bookings.bookable_type', '=', Bed::class);
            })
            ->select('buildings.id', 'buildings.name', DB::raw('COUNT(bookings.id) as bookings_count'))
            ->groupBy('buildings.id', 'buildings.name')
            ->orderByDesc('bookings_count')
            ->limit(5)
            ->get();


        $topSellers = Seller::select('sellers.*')
            // count bookings
            ->selectSub(function ($query) {
                $query->from('beds')
                    ->join('rooms', 'rooms.id', '=', 'beds.room_id')
                    ->join('buildings', 'buildings.id', '=', 'rooms.building_id')
                    ->join('bookings', function ($join) {
                        $join->on('bookings.bookable_id', '=', 'beds.id')
                            ->where('bookings.bookable_type', '=', Bed::class)
                            ->where('bookings.status', '=', 'ended'); // only ended
                    })
                    ->whereColumn('sellers.id', 'buildings.seller_id')
                    ->whereNull('buildings.deleted_at')
                    ->selectRaw('COUNT(bookings.id)');
            }, 'bookings_count')

            // sum receipts (earnings)
            ->selectSub(function ($query) {
                $query->from('beds')
                    ->join('rooms', 'rooms.id', '=', 'beds.room_id')
                    ->join('buildings', 'buildings.id', '=', 'rooms.building_id')
                    ->join('bookings', function ($join) {
                        $join->on('bookings.bookable_id', '=', 'beds.id')
                            ->where('bookings.bookable_type', '=', Bed::class)
                            ->where('bookings.status', '=', 'ended'); // only ended
                    })
                    ->join('receipts', 'receipts.booking_id', '=', 'bookings.id')
                    ->whereColumn('sellers.id', 'buildings.seller_id')
                    ->whereNull('buildings.deleted_at')
                    ->selectRaw('SUM(receipts.amount)');
            }, 'earnings_sum')
            ->having('bookings_count', '>', 0)
            ->orderByDesc('bookings_count')
            ->limit(5)
            ->get();
    
        $recentBookers = Booking::with('user')->latest()->take(5)->get();
        $recentUsers = User::latest()->take(5)->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'charts' => [
                'monthlyEarnings' => $monthlyEarnings,
                'monthlyBookings' => $monthlyBookings,
                'ratings' => $ratings,
                'cancels' => $cancels,
                'topFeatures' => $topFeatures,
                'topBuildings' => $topBuildings,
            ],
            'tables' => [
                'topSellers' => $topSellers,
                'recentBookers' => $recentBookers,
                'recentUsers' => $recentUsers,
            ],
        ]);
    }
}
