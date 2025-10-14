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
        Schema::table('default_messages', function (Blueprint $table) {
            $table->renameColumn('type', 'remarks');
            $table->renameColumn('owner_type', 'type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('default_messages', function (Blueprint $table) {
            $table->renameColumn('remarks', 'type');
            $table->renameColumn('type', 'owner_type');
        });
    }
};
