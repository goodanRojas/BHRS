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
        Schema::create('owner_payment_infos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('sellers')->onDelete('cascade');
            $table->string('qr_code')->nullable();
            $table->string('gcash_number')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('owner_payment_infos');
    }
};
