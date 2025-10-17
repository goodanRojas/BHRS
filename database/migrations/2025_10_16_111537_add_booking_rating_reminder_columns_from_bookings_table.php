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
            $table->boolean('is_rated')->default(false)->after('warned');
            $table->timestamp('last_rating_reminder_at')->nullable()->after('is_rated');
            $table->unsignedSmallInteger('rating_reminder_count')->default(0)->after('last_rating_reminder_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->dropColumn(['is_rated', 'last_rating_reminder_at', 'rating_reminder_count']);
        });
    }
};
