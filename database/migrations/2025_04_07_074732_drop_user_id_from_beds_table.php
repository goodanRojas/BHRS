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
        Schema::table('beds', function (Blueprint $table) {
            //
            $table->dropForeign(['user_id']);
            $table->text('description')->nullable()->after('name');

            // Then drop the column
            $table->dropColumn('user_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('beds', function (Blueprint $table) {
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('description')->nullable()->after('name');
            // Re-add the foreign key constraint
            $table->foreign('user_id')->references('id')->on('users')->onDelete('set null');
       
        });
    }
};
