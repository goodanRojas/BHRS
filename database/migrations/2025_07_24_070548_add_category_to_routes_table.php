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
        Schema::table('routes', function (Blueprint $table) {
            $table->string('category', )->default('other')->after('building_id')->comment('eatery', 'school_supply', 'school', 'other');
            $table->string('destination', 191)->after('coordinates');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('routes', function (Blueprint $table) {
            $table->dropColumn('category');
            $table->dropColumn('destination');
        });
    }
};
