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
            $table->foreignId('seller_id')->constrained()->onDelete('cascade');
            $table->string('name');
            $table->json('address')->comment('An object of arrays');
            $table->integer('number_of_floors');
            $table->string('bir');
            $table->string('fire_safety_certificate');
            $table->integer('number_of_rooms');
            $table->json('amenities')->comment('An array of amenities such as Water, Wi-Fi Kitchen etc..');
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
