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
        Schema::create('rejections', function (Blueprint $table) {
       $table->id();
            $table->morphs('rejectable'); // Adds `rejectable_id` and `rejectable_type` columns
            $table->text('reason'); // Reason for rejection
            $table->enum('status', [ 'cancelled', 'rejected']); // Status of the rejection
            $table->unsignedBigInteger('rejected_by'); // Who rejected it (can be a user ID)
            $table->timestamps(); 
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rejections');
    }
};
