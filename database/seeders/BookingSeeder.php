<?php

namespace Database\Seeders;

use App\Models\{Seller, Building, Room, Bed, Booking, User};
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class BookingSeeder extends Seeder
{
    public function run(): void
    {
        $sellerId = 121;

        // Check if the seller exists
        $seller = Seller::find($sellerId);
        if (!$seller) {
            $this->command->warn("Seller with ID $sellerId not found.");
            return;
        }

        // Create 1 building for the seller
        $building = $seller->buildings()->create([
            'name' => 'Sample Building',
            'image' => 'building.jpg',
            'address' => '123 Example St.',
            'latitude' => 14.5995,
            'longitude' => 120.9842,
        ]);

        // Create 3 rooms for that building
        $rooms = Room::factory()->count(3)->create([
            'building_id' => $building->id,
        ]);

        foreach ($rooms as $room) {
            // Create 2 beds for each room
            $beds = Bed::factory()->count(2)->create([
                'room_id' => $room->id,
            ]);

            // Create booking for the room
            Booking::create([
                'user_id' => User::inRandomOrder()->first()->id,
                'bookable_id' => $room->id,
                'bookable_type' => Room::class,
                'start_date' => Carbon::now(),
                'end_date' => Carbon::now()->addDays(5),
                'total_price' => $room->sale_price ?? $room->price ?? 1000,
                'status' => collect(['cancelled', 'pending', 'approved', 'completed', 'confirmed'])->random(),
            ]);

            // Create bookings for each bed
            foreach ($beds as $bed) {
                Booking::create([
                    'user_id' => User::inRandomOrder()->first()->id,
                    'bookable_id' => $bed->id,
                    'bookable_type' => Bed::class,
                    'start_date' => Carbon::now()->addDays(1),
                    'end_date' => Carbon::now()->addDays(6),
                    'total_price' => $bed->sale_price ?? $bed->price ?? 500,
                    'status' => collect(['cancelled', 'pending', 'approved', 'completed', 'confirmed'])->random(),
                ]);
            }
        }
    }
}
