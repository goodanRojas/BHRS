<?php

namespace Database\Seeders;

use App\Models\Bed;
use App\Models\Room;
use App\Models\Building;
use App\Models\User;
use App\Models\Feedback;
use Illuminate\Database\Seeder;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class GeneralSeeder extends Seeder{

        public function run(): void
        {
            // Make sure there are enough users
            if (User::count() < 30) {
                User::factory(30)->create();
            }
    
            // Seed Feedback for Beds
            Bed::all()->each(function ($bed) {
                $users = User::inRandomOrder()->take(10)->get();
                $users->each(function ($user) use ($bed) {
                    Feedback::factory()->create([
                        'feedbackable_id' => $bed->id,
                        'feedbackable_type' => Bed::class,
                        'user_id' => $user->id,
                    ]);
                });
            });
    
            // Seed Feedback for Rooms
            Room::all()->each(function ($room) {
                $users = User::inRandomOrder()->take(10)->get();
                $users->each(function ($user) use ($room) {
                    Feedback::factory()->create([
                        'feedbackable_id' => $room->id,
                        'feedbackable_type' => Room::class,
                        'user_id' => $user->id,
                    ]);
                });
            });
    
            // Seed Feedback for Buildings
            Building::all()->each(function ($building) {
                $users = User::inRandomOrder()->take(10)->get();
                $users->each(function ($user) use ($building) {
                    Feedback::factory()->create([
                        'feedbackable_id' => $building->id,
                        'feedbackable_type' => Building::class,
                        'user_id' => $user->id,
                    ]);
                });
            });
        }
    }
    
