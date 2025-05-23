<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

class AddRejectedToBookingStatus extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // Alter the 'status' column to add 'rejected' to the enum
        DB::statement("ALTER TABLE bookings CHANGE status status ENUM('pending', 'approved', 'cancelled', 'completed', 'rejected') NOT NULL");	
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        // Rollback the enum changes by removing 'rejected'
        DB::statement("ALTER TABLE bookings CHANGE status status ENUM('pending', 'approved', 'cancelled', 'completed') NOT NULL");
    }
}
