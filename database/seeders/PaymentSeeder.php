<?php

namespace Database\Seeders;

use App\Models\{Booking, Payment, Room, Bed, Building, Seller};
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class PaymentSeeder extends Seeder
{
    public function run(): void
    {
        $sellerId = 121;

        $buildingIds = Building::where('seller_id', $sellerId)->pluck('id');
        $roomIds = Room::whereIn('building_id', $buildingIds)->pluck('id');
        $bedIds = Bed::whereIn('room_id', $roomIds)->pluck('id');

        $bedBookings = Booking::where('bookable_type', Bed::class)
            ->whereIn('bookable_id', $bedIds)
            ->inRandomOrder()
            ->limit(6)
            ->get();

        $roomBookings = Booking::where('bookable_type', Room::class)
            ->whereIn('bookable_id', $roomIds)
            ->inRandomOrder()
            ->limit(3)
            ->get();

        foreach ($bedBookings as $booking) {
            $status = collect(['pending', 'completed', 'failed'])->random();

            Payment::create([
                'user_id' => $booking->user_id,
                'booking_id' => $booking->id,
                'amount' => $booking->total_price,
                'payment_method' => collect(['cash', 'gcash'])->random(),
                'status' => $status,
                'transaction_id' => 'TXN-' . strtoupper(uniqid()),
                'receipt' => 'receipt_' . $booking->id . '.jpg',
                'paid_at' => Carbon::now(),
            ]);

            if ($status === 'completed') {
                $booking->update(['status' => 'approved']);
            }
            else if ($status === 'pending' || $status === 'failed') {
                $booking->update(['status' => 'pending']);
            }
        }

        foreach ($roomBookings as $booking) {
            $status = collect(['pending', 'completed', 'failed'])->random();

            Payment::create([
                'user_id' => $booking->user_id,
                'booking_id' => $booking->id,
                'amount' => $booking->total_price,
                'payment_method' => collect(['cash', 'gcash'])->random(),
                'status' => $status,
                'transaction_id' => 'TXN-' . strtoupper(uniqid()),
                'receipt' => 'receipt_' . $booking->id . '.jpg',
                'paid_at' => Carbon::now()->subDay(),
            ]);

            if ($status === 'completed') {
                $booking->update(['status' => 'approved']);
            }
            else if ($status === 'pending' || $status === 'failed') {
                $booking->update(['status' => 'pending']);
            }
        }
    }
}
