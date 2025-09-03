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
        Schema::table('owner_payment_infos', function (Blueprint $table) {
            $table->string('gcash_name')->nullable()->after('gcash_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('owner_payment_infos', function (Blueprint $table) {
            $table->dropColumn('gcash_name');
        });
    }
};
