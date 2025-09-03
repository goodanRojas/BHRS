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
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn('end_date'); // Drop the 'end_date' column
            $table->integer('month_count')->default(1); // Add 'month_count' column with default value
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->timestamp('end_date')->nullable(); // Restore 'end_date' column
            $table->dropColumn('month_count'); // Remove 'month_count' column
        });
    }
};
