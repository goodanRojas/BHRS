<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\{    DB, Schema};

return new class extends Migration
{
    public function up(): void
    {
        // Change enum to include 'cancelled'
        DB::statement("ALTER TABLE building_applications MODIFY status ENUM('pending', 'approved', 'rejected', 'cancelled') NOT NULL DEFAULT 'pending'");
    }

    public function down(): void
    {
        // Revert back to old enum without 'cancelled'
        DB::statement("ALTER TABLE building_applications MODIFY status ENUM('pending', 'approved', 'rejected') NOT NULL DEFAULT 'pending'");
    }
};
