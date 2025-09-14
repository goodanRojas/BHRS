<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\{Building, Address, Receipt, Rating, Comment, Bed, Booking, Cancel};
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class SellerDashboardController extends Controller
{
    public function index()
    {
        $seller = auth()->guard('seller')->user();

        // ✅ Get only this seller's buildings
        $buildings = Building::where('seller_id', $seller->id)
            ->with('rooms.beds')
            ->get();

        // ✅ Beds under this seller's buildings
        $beds = Bed::whereHas('room.building', function ($q) use ($seller) {
            $q->where('seller_id', $seller->id);
        })->with('room.building')->get();

        // ✅ Bookings only for those beds
        $bookings = Booking::where('bookable_type', Bed::class)
            ->whereIn('bookable_id', $beds->pluck('id'))
            ->with(['bookable.room.building', 'receipt'])
            ->get();

        // Related data scoped by those bookings
        $cancellations = Cancel::whereIn('booking_id', $bookings->pluck('id'))->get();
        $comments = Comment::whereIn('booking_id', $bookings->pluck('id'))->get();
        $receipts = Receipt::whereIn('booking_id', $bookings->pluck('id'))->get();
        $ratings = Rating::whereIn('booking_id', $bookings->pluck('id'))->get();

        // Addresses for seller's buildings
        $addresses = Address::whereIn('addressable_id', $buildings->pluck('id'))
            ->where('addressable_type', Building::class)
            ->get();

        // KPIs
        $summary = [
            'totalBuildings' => $buildings->count(),
            'totalBeds' => $beds->count(),
            'availableBeds' => $beds->count() - $bookings->where('status', 'completed')->count(),
            'activeBookings' => $bookings->where('status', 'completed')->count(),
            'monthlyEarnings' => $this->monthlyEarnings($receipts),
            'avgRating' => round($ratings->avg('score') ?? 0, 2),
            'cancellations' => $cancellations->count(),
        ];

        // Insights
        $insights = [
            'occupancyRate' => $this->bedOccupancyRate($beds, $bookings),
            'mostBookedBeds' => $this->mostBookedBeds($bookings),
            'cancellationTrend' => $this->cancellationTrend($cancellations),
            'ratingsByBuilding' => $this->ratingsByBuilding($ratings, $buildings),
            'earningsByAddress' => $this->earningsByAddress($receipts, $bookings, $addresses),
            'occupancyByAddress' => $this->occupancyByAddress($buildings, $bookings),
            'paymentMethods' => $this->paymentMethodDistribution($receipts),
        ];

        return inertia('Seller/Dashboard', [
            'summary' => $summary,
            'insights' => $insights,
        ]);
    }


    /** 🔹 Financials */
    private function monthlyEarnings($receipts)
    {
        return $receipts->groupBy(function ($r) {
            return Carbon::parse($r->updated_at)->format('Y-m');
        })->map(fn($r) => $r->sum('amount'));
    }

    private function paymentMethodDistribution($receipts)
    {
        return $receipts->groupBy('payment_method')
            ->map(fn($r) => $r->count());
    }

    /** 🔹 Occupancy */
    private function bedOccupancyRate($beds, $bookings)
    {
        $totalBeds = $beds->count();
        $activeBookings = $bookings->where('status', 'completed')->count();
        return $totalBeds > 0 ? round(($activeBookings / $totalBeds) * 100, 2) : 0;
    }

    /** 🔹 Popular Beds */
    private function mostBookedBeds($bookings)
    {
        return $bookings->groupBy('bookable_id')
            ->map(function ($b, $bedId) {
                $bed = Bed::with('room')->find($bedId);

                return [
                    'bed_name' => $bed?->name ?? "Bed #$bedId",
                    'room_name' => $bed?->room?->name ?? 'Unknown Room',
                    'count' => $b->count(),
                ];
            })
            ->sortByDesc('count')
            ->take(5)
            ->values(); // reset keys for JSON
    }


    /** 🔹 Cancellations */
    private function cancellationTrend($cancellations)
    {
        return $cancellations->groupBy(function ($c) {
            return Carbon::parse($c->updated_at)->format('Y-m');
        })->map(fn($c) => $c->count())
        ->sortKeys();
    }

    /** 🔹 Ratings */
    private function ratingsByBuilding($ratings, $buildings)
    {
        return $buildings->mapWithKeys(function ($building) use ($ratings) {
            // collect booking_ids from building → rooms → beds
            $bookingIds = $building->rooms->flatMap->beds->flatMap->bookings->pluck('id');
            $buildingRatings = $ratings->whereIn('booking_id', $bookingIds);
            return [$building->id => round($buildingRatings->avg('score') ?? 0, 2)];
        });
    }

    /** 🔹 Address Insights */
    private function earningsByAddress($receipts, $bookings, $addresses)
    {
        return $addresses->mapWithKeys(function ($address) use ($receipts, $bookings) {
            $buildingBookingIds = $bookings
                ->filter(fn($b) => $b->bookable && $b->bookable->room->building_id === $address->addressable_id)
                ->pluck('id');

            $buildingReceipts = $receipts->whereIn('booking_id', $buildingBookingIds);

            return [
                $address->addressable_id => [
                    'address' => $address->address,
                    'earnings' => $buildingReceipts->sum('amount'),
                ]
            ];
        });
    }

    private function occupancyByAddress($buildings, $bookings)
    {
        return $buildings->mapWithKeys(function ($building) use ($bookings) {
            $beds = $building->rooms->flatMap->beds;
            $activeBookings = $bookings
                ->whereIn('bookable_id', $beds->pluck('id'))
                ->where('status', 'completed')
                ->count();

            $occupancy = $beds->count() > 0 ? round(($activeBookings / $beds->count()) * 100, 2) : 0;

            return [
                $building->id => [
                    'name' => $building->name,
                    'occupancy' => $occupancy,
                ]
            ];
        });
    }
}
