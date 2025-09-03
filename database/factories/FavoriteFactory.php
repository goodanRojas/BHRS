<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Favorite;
use App\Models\User;
use App\Models\Room;
use App\Models\Building;

class FavoriteFactory extends Factory
{
    protected $model = Favorite::class;

    public function definition()
    {
        $favoritable = $this->faker->randomElement([
            Room::class,
            Building::class
        ]);

        return [
            'user_id' => User::factory(),
            'favoritable_id' => $favoritable::factory(),
            'favoritable_type' => $favoritable,
        ];
    }
}
