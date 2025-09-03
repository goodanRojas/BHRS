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
        Schema::table('payments', function (Blueprint $table) {
            // Drop polymorphic columns if they exist
            if (Schema::hasColumn('payments', 'payable_id')) {
                $table->dropColumn('payable_id');
            }

            if (Schema::hasColumn('payments', 'payable_type')) {
                $table->dropColumn('payable_type');
            }

            // Add booking_id foreign key
            $table->unsignedBigInteger('booking_id')->nullable()->after('user_id');
            $table->foreign('booking_id')->references('id')->on('bookings')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payments', function (Blueprint $table) {
            // Remove booking_id
            $table->dropForeign(['booking_id']);
            $table->dropColumn('booking_id');

            // Re-add polymorphic fields if needed
            $table->unsignedBigInteger('payable_id')->nullable();
            $table->string('payable_type')->nullable();
        });
    }
};
