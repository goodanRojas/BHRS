<?php

namespace Database\Factories;

use App\Models\Bed;
use App\Models\Room;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Bed>
 */
class BedFactory extends Factory
{
    protected $model = Bed::class;

    public function definition(): array
    {
        $price = $this->faker->randomFloat(2, 500, 3000);

        return [
            'user_id' => User::factory(),
            'room_id' => Room::factory(),
            'name' => $this->faker->word() . ' Bed',
            'image' => $this->faker->randomElement([
                'https://media.istockphoto.com/id/1467126728/photo/modern-scandinavian-and-japandi-style-bedroom-interior-design-with-bed-white-color-wooden.jpg?s=612x612&w=0&k=20&c=oa94MeFcLIs6l4hJQGztLbWe3BGOH9LtvLebnUXgUus=',
                'https://m.media-amazon.com/images/I/816MIzKKcPL.jpg',
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTy2ElWH1JIzuksG9C2bjTgwzjbrX-6elXcpg&s',
                'https://www.shutterstock.com/image-photo/stylish-bedroom-interior-comfortable-bed-600nw-2341693057.jpg',
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTaHou9rNcThFEzBkkUu0Pf8P3e_SqYlDp1GQ&s',
                'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRFdmSZ9d7hmZkKjoFprlOJkGX5xpipABK4Cg&s',

            ]),
            'price' => $price,
            'sale_price' => $this->faker->randomFloat(2, 300, $price), // Always set sale_price
        ];
    }
}
