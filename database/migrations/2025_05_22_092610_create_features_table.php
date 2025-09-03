<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
   public function up()
    {
        Schema::create('features', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Name of the feature (e.g., Wi-Fi, AC)
            $table->text('description')->nullable(); // Optional description of the feature
            $table->unsignedBigInteger('featureable_id'); // Foreign key to Building, Room, or Bed
            $table->string('featureable_type'); // The type of featureable (Building, Room, or Bed)
            $table->timestamps(); // created_at and updated_at
         });
    }

    public function down()
    {
        Schema::dropIfExists('features');
    }
};
