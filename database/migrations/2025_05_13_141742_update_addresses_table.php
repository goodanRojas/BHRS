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
                Schema::table('addresses', function (Blueprint $table) {
            // Drop the old foreign key if it exists
            if (Schema::hasColumn('addresses', 'user_id')) {
                $table->dropForeign(['user_id']);
                $table->dropColumn('user_id');
            }

            // Add polymorphic columns
            $table->unsignedBigInteger('addressable_id')->nullable()->after('id');
            $table->string('addressable_type')->nullable()->after('addressable_id');

            // Add coordinates
            $table->decimal('latitude', 10, 7)->nullable()->after('country');
            $table->decimal('longitude', 10, 7)->nullable()->after('latitude');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
          Schema::table('addresses', function (Blueprint $table) {
            $table->dropColumn(['addressable_id', 'addressable_type', 'latitude', 'longitude']);

            // Optional: Restore user_id if rolling back
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');
        });
    }
};
