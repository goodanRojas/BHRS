<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::dropIfExists('routes');
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
           Schema::create('routes', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Optional: Name of the route
            $table->json('path'); // Store the path as a JSON array of coordinates
            $table->foreignId('start_building_id')->constrained('buildings');
            $table->foreignId('end_building_id')->constrained('buildings');
            $table->timestamps();
        });
    }
};
