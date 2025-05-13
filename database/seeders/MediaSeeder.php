<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Media;
use App\Models\Room;
use App\Models\Bed;


class MediaSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $images = ['image1.webp', 'image2.webp', 'image3.webp', 'image4.webp', 'image5.webp'];

        // Attach images to each room
        foreach (Room::all() as $room) {
            foreach ($images as $index => $filename) {
                Media::create([
                    'imageable_id' => $room->id,
                    'imageable_type' => Room::class,
                    'file_path' => $filename,
                    'alt_text' => 'Room Image ' . ($index + 1),
                    'order' => $index + 1,
                ]);
            }
        }

        // Attach images to each bed
        foreach (Bed::all() as $bed) {
            foreach ($images as $index => $filename) {
                Media::create([
                    'imageable_id' => $bed->id,
                    'imageable_type' => Bed::class,
                    'file_path' => $filename,
                    'alt_text' => 'Bed Image ' . ($index + 1),
                    'order' => $index + 1,
                ]);
            }
        }
    }
}
