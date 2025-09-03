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
        Schema::create('building_applications', function (Blueprint $table) {
            $table->id();
              $table->foreignId('seller_id')->constrained()->onDelete('cascade'); // seller_id foreign key
            $table->string('building_name');
            $table->string('number_of_floors');
            $table->string('bir')->nullable();  // Store the file path or name
            $table->string('fire_safety_certificate')->nullable();  // Store the file path or name
            $table->integer('number_of_rooms');
            $table->integer('number_of_beds');
            $table->string('address');
            $table->string('status')->default('pending');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('building_applications');
    }
};
