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
        // Step 1: Create the destinations table
        Schema::create('route_destinations', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // e.g. "FEU Gate 1"
            $table->string('image')->nullable(); // optional image
            $table->decimal('latitude', 10, 7);  // precise coordinates
            $table->decimal('longitude', 10, 7);
            $table->string('category')->nullable()->comment('optional: school, eatery, school supply, gym, etc.'); // optional: school, eatery, etc.
            $table->timestamps();
        });

        // Step 2: Modify the routes table
        Schema::table('routes', function (Blueprint $table) {
            $table->dropColumn('destination'); // drop old string field
            $table->dropColumn('category');
            $table->foreignId('destination_id')
                  ->nullable()
                  ->constrained('route_destinations')
                  ->onDelete('set null')
                  ->after('coordinates');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Step 1: Remove foreign key and column from routes
        Schema::table('routes', function (Blueprint $table) {
            $table->dropForeign(['destination_id']);
            $table->dropColumn('destination_id');
            $table->string('destination')->nullable(); // restore old string column
            $table->string('category')->nullable();
        });

        // Step 2: Drop the destinations table
        Schema::dropIfExists('route_destinations');
    }
};
