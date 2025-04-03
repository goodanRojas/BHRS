<?php

namespace Database\Factories;

use App\Models\Room;
use App\Models\Building;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Room>
 */
class RoomFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Room::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $price = $this->faker->randomFloat(2, 1000, 5000);
        return [
            'building_id' => Building::factory(),
            'user_id' => User::factory(),
            'name' => $this->faker->word,
            'image' => $this->faker->imageUrl(640, 480, 'room'),
            'price' => $price,
            'sale_price' => $this->faker->optional(0.7, $price)->randomFloat(2, 500, $price), // 70% chance to generate sale price, otherwise same as price
        ];
    }
}
