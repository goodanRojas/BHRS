<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Building;
use App\Models\Address;

class BuildingAddressSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
         $buildings = Building::all();

        // Loop through each building and assign an address
        foreach ($buildings as $building) {
            Address::create([
                'addressable_id' => $building->id,
                'addressable_type' => Building::class, // Polymorphic type (this will be the class name)
                'street' => 'Sample Street', // Replace with actual data or logic
                'barangay' => 'Sample Barangay', // Replace with actual data
                'city' => 'Sample City', // Replace with actual data
                'province' => 'Sample Province', // Replace with actual data
                'postal_code' => '12345', // Replace with actual data
                'country' => 'Sample Country', // Replace with actual data
                'latitude' => '12.3456', // Optional, if required
                'longitude' => '78.9012', // Optional, if required
            ]);
        };
    }
}
