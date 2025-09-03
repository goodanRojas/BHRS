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
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->foreignId('sender_id')->constrained('users')->onDelete('cascade'); // User who sends the message
            $table->foreignId('receiver_id')->constrained('users')->onDelete('cascade'); // User who receives the message
            $table->text('content'); // Message content
            $table->boolean('is_read')->default(false); // Whether the message has been read
            $table->timestamp('sent_at')->useCurrent(); // Timestamp when the message was sent
            $table->timestamps();
        });
        
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
