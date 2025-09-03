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
        $table->dropColumn('street');
        $table->dropColumn('barangay');
        $table->dropColumn('city');
        $table->dropColumn('province');
        $table->dropColumn('postal_code');
        $table->dropColumn('country');
        $table->text('special_request')->nullable()->change()->after('phone');
        });

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('bookings', function (Blueprint $table) {
            $table->string('street')->after('phone');
            $table->string('barangay')->after('street');
            $table->string('city')->after('barangay');
            $table->string('province')->after('city');
            $table->string('postal_code')->after('province');
            $table->string('country')->after('postal_code');
            $table->dropColumn('special_request');
        });
    }
};
