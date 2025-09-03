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
            $table->dropColumn('remarks');
            $table->dropColumn('receipt_image');
            $table->dropColumn('transaction_id');
            $table->string('user_remarks', 255)->nullable()->after('status');
            $table->string('owner_remarks', 255)->nullable()->after('user_remarks');
            $table->string('ref_number', 255)->nullable()->after('owner_remarks');


        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('receipts', function (Blueprint $table) {
            $table->dropColumn('owner_remarks');
            $table->dropColumn('user_remarks');
            $table->dropColumn('ref_number');
            $table->string('receipt_image')->nullable();
            $table->string('transaction_id')->nullable();
            $table->string('remarks')->nullable();
        });
    }
};
