<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use App\Models\{Bed, Room, User, Booking, Rating, Cancel, Comment, Receipt};
class SampleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run()
    {
        $users = User::pluck('id')->toArray();

        // Create 4 Rooms for building_id = 17
        for ($i = 1; $i <= 4; $i++) {
            $room = Room::create([
                'building_id' => 17,
                'name' => "Room {$i}",
                'image' => 'sample',
                'description' => "Description for Room {$i}",
                'created_at' => now(),
                'updated_at' => now(),
            ]);

            // Create 5 Beds per room
            for ($j = 1; $j <= 5; $j++) {
                $bed = Bed::create([
                    'room_id' => $room->id,
                    'name' => "Bed {$j} in Room {$i}",
                    'description' => "Description for Bed {$j} in Room {$i}",
                    'image' => 'sample',
                    'price' => 2500,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
                $randomDate = function () {
                    return Carbon::createFromTimestamp(
                        rand(Carbon::create(2020, 1, 1)->timestamp, Carbon::create(2026, 12, 31)->timestamp)
                    );
                };
                // Create 2 bookings per bed
                for ($k = 1; $k <= 2; $k++) {
                    $userId = $users[array_rand($users)];
                    $updatedAt = $randomDate();
                    $booking = Booking::create([
                        'user_id' => $userId,
                        'bookable_type' => Bed::class,
                        'bookable_id' => $bed->id,
                        'start_date' => Carbon::now()->subMonths(rand(1, 6))->toDateString(),
                        'total_price' => $bed->price,
                        'special_request' => null,
                        'status' => 'ended',
                        'payment_method' => 'cash',
                        'agreed_to_terms' => 1,
                        'month_count' => rand(1, 6),
                        'created_at' => now(),
                        'updated_at' => $updatedAt
                    ]);
                    Receipt::create([
                        'booking_id' => $booking->id,
                        'user_receipt' => 'user_receipt.jpg',
                        'seller_receipt' => 'seller_receipt.jpg',
                        'payment_method' => 'cash',
                        'amount' => $bed->price,
                        'status' => 'completed',
                        'user_remarks' => 'User paid in cash',
                        'owner_remarks' => 'Payment received',
                        'user_ref_number' => 'U' . rand(10000, 99999),
                        'owner_ref_number' => 'O' . rand(10000, 99999),
                        'paid_at' => now(),
                        'created_at' => now(),
                        'updated_at' => $updatedAt
                    ]);

                    Cancel::create([
                        'user_id' => $userId,
                        'booking_id' => $booking->id,
                        'reason' => "This is a sample cancel for booking {$booking->id}",
                        'created_at' => now(),
                        'updated_at' => $updatedAt
                    ]);
                    // Add rating
                    Rating::create([
                        'booking_id' => $booking->id,
                        'user_id' => $userId,
                        'stars' => rand(3, 5), // positive ratings
                        'created_at' => now(),
                        'updated_at' => $updatedAt
                    ]);

                    // Add comment
                    Comment::create([
                        'booking_id' => $booking->id,
                        'user_id' => $userId,
                        'body' => "This is a sample comment for booking {$booking->id}",
                        'edited' => null,
                        'created_at' => now(),
                        'updated_at' => $updatedAt
                    ]);
                }
            }
        }
    }
}
