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
        // Alter the 'buildings' table
        Schema::table('buildings', function (Blueprint $table) {
            // Drop the 'address' column if it exists
            $table->dropColumn('address');

            // Add new columns
            $table->integer('number_of_floors');
            $table->string('bir');
            $table->string('business_permit');
            $table->smallInteger('status')->default(0);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Revert the 'buildings' table changes
        Schema::table('buildings', function (Blueprint $table) {
            // Add the 'address' column back
            $table->string('address');

            // Drop the newly added columns
            $table->dropColumn('number_of_floors');
            $table->dropColumn('bir');
            $table->dropColumn('business_permit');
            $table->dropColumn('status');
        });
    }
};
