<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('user_sessions', function (Blueprint $table) {
            $table->id();
            $table->morphs('user'); // Adds 'user_id' and 'user_type' columns for polymorphic relation
            $table->text('session_data'); // To store session data (payload, etc.)
            $table->integer('last_activity'); // To track last activity
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('user_sessions');
    }
};
