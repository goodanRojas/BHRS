<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;
use App\Models\Payment;
use App\Models\User;
use App\Models\Booking;
use App\Models\Bed;
use Carbon\Carbon;

class PaymentFactory extends Factory
{
    protected $model = Payment::class;

    public function definition()
    {
        $payable = $this->faker->randomElement([
            Booking::class,
            Bed::class
        ]);

        return [
            'user_id' => User::factory(),
            'payable_id' => $payable::factory(),
            'payable_type' => $payable,
            'amount' => $this->faker->randomFloat(2, 500, 5000),
            'payment_method' => $this->faker->randomElement(['gcash', 'cash']),
            'status' => $this->faker->randomElement(['pending', 'completed', 'failed']),
            'transaction_id' => $this->faker->uuid(),
            'receipt' => $this->faker->imageUrl(200, 200, 'receipt'),
            'paid_at' => $this->faker->boolean(80) ? Carbon::now()->subDays($this->faker->numberBetween(1, 30)) : null,
        ];
    }
}
