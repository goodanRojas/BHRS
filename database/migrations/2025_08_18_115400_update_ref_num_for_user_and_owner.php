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
        Schema::table('receipts', function (Blueprint $table) {
            $table->dropColumn('ref_number');
            $table->string('user_ref_number', 255)->nullable()->after('owner_remarks');
            $table->string('owner_ref_number', 255)->nullable()->after('user_ref_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('receipts', function (Blueprint $table) {
            $table->dropColumn('user_ref_number');
            $table->dropColumn('owner_ref_number');
            $table->string('ref_number', 255)->nullable()->after('owner_remarks');
        });
    }
};
