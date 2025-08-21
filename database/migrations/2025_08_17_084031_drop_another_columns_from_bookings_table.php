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
            $table->dropColumn('fullname'); // Drop the 'end_date' column
            $table->dropColumn('email'); // Drop the 'end_date' column
            $table->dropColumn('phone'); // Drop the 'end_date' column

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->string('fullname')->nullable(); // Recreate the 'fullname' column
            $table->string('email');
            $table->string('phone')->nullable(); // Recreate the 'phone' column
        });
    }
};
