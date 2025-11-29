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
        Schema::create('customer_supports', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('email');
            $table->string('name');
            $table->text('message');
            $table->text('response')->nullable();
            $table->string('attachment')->nullable();
            $table->string('category')->comment('e.g., booking, recommendation, map, account')->nullable();
            $table->enum('priority', ['low', 'medium', 'high'])->default('low');
            $table->enum('status', ['open', 'in_progress', 'closed'])->default('open');
            $table->timestamp('resolved_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('customer_supports');
    }
};
