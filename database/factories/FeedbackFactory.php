<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Bed;
use App\Models\Room;
use App\Models\User;
use App\Models\Building;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Feedback>
 */
class FeedbackFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        $feedbackable = $this->faker->randomElement([
          
            Bed::class,
        ]);

        return [
            'user_id' => User::factory(),
            'feedbackable_id' => $feedbackable::factory(),
            'feedbackable_type' => $feedbackable,
            'rating' => $this->faker->numberBetween(1, 5),
            'comment' => $this->faker->sentence(),
        ];
    }
}
