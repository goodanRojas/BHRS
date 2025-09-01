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
        Schema::create('rules_and_regulations', function (Blueprint $table) {
            $table->id();
            $table->foreignId('landowner_id')
                ->constrained('sellers') // assuming "sellers" is your landowner table
                ->onDelete('cascade');
            $table->foreignId('building_id')
                ->constrained('buildings')
                ->onDelete('cascade');
            $table->string('title'); // e.g., "No Smoking"
            $table->text('description')->nullable(); // details of the rule
            $table->enum('status', ['active', 'inactive'])->default('active'); // visibility
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rules_and_regulations');
    }
};
