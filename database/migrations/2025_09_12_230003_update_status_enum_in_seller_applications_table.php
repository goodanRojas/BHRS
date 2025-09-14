<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('seller_applications', function (Blueprint $table) {
            DB::statement("ALTER TABLE seller_applications 
            MODIFY status ENUM('pending', 'approved', 'rejected', 'cancelled') 
            NOT NULL DEFAULT 'pending'");
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('seller_applications', function (Blueprint $table) {
               DB::statement("ALTER TABLE seller_applications 
            MODIFY status ENUM('pending', 'approved', 'rejected') 
            NOT NULL DEFAULT 'pending'");
        });
    }
};
