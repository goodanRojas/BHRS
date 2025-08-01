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
        Schema::table('users', function (Blueprint $table) {
            $table->boolean('is_online')->default(false)->after('avatar');
        });
    
        Schema::table('sellers', function (Blueprint $table) {
            $table->boolean('is_online')->default(false)->after('ai_on');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('is_online');
        });
        Schema::table('sellers', function (Blueprint $table) {
            $table->dropColumn('is_online');
        });
    }
};
