<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Booking;
use App\Models\User;
use App\Models\Room;
use App\Models\Bed;
use Carbon\Carbon;

class BookingFactory extends Factory
{
    protected $model = Booking::class;

    public function definition()
    {
        $bookable = $this->faker->randomElement([
            Room::class,
            Bed::class
        ]);

        $startDate = Carbon::now()->addDays($this->faker->numberBetween(1, 30));
        $endDate = (clone $startDate)->addDays($this->faker->numberBetween(1, 30));

        return [
            'user_id' => User::factory(),
            'bookable_id' => $bookable::factory(),
            'bookable_type' => $bookable,
            'start_date' => $startDate,
            'end_date' => $endDate,
            'total_price' => $this->faker->randomFloat(2, 1000, 10000),
            'status' => $this->faker->randomElement(['pending', 'confirmed', 'cancelled']),
        ];
    }
}
