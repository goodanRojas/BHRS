<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->timestamp('email_verified_at')->nullable();
            $table->string('password');
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('sellers', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('email')->unique();
            $table->string('password');
            $table->string('image')->nullable();
            $table->string('address')->nullable();
            $table->string('phone')->nullable();
            $table->rememberToken();
            $table->timestamps();
        });

        Schema::create('buildings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained('sellers')->onDelete('cascade');
            $table->string('image')->default('building.jpg');
            $table->string('name');
            $table->string('address');
            $table->string('longitude');
            $table->string('latitude');
            $table->timestamps();
        });

        Schema::create('rooms', function (Blueprint $table) {
            $table->id();
            $table->foreignId('building_id')->constrained('buildings')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('name');
            $table->string('image')->default('room.jpg');
            $table->float('price');
            $table->float('sale_price');
            $table->timestamps();
        });

        Schema::create('beds', function (Blueprint $table) {
            $table->id();
            $table->foreignId("user_id")->constrained('users')->onDelete('cascade');
            $table->foreignId('room_id')->constrained('rooms')->onDelete('cascade');
            $table->string('name');
            $table->string('image')->default('bed.jpg');
            $table->float('price');
            $table->float('sale_price');
            $table->timestamps();
        });

        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->morphs('bookable');
            $table->date('start_date');
            $table->date('end_date');
            $table->float('total_price');
            $table->enum('status', ['cancelled', 'pending', 'approved', 'completed', 'confirmed']);
            $table->timestamps();
        });


        Schema::create('payments', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->morphs('payable');
            $table->decimal('amount', 10, 2);
            $table->enum('payment_method', ['gcash', 'cash']);
            $table->enum('status', ['pending', 'completed', 'failed'])->default('pending'); // Added status column
            $table->string('transaction_id')->nullable(); // Optional transaction reference
            $table->string('receipt')->nullable(); // Optional proof of payment
            $table->timestamp('paid_at')->nullable(); // Date and time payment was made
            $table->timestamps();
        });
        

        Schema::create('feedbacks', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->morphs('feedbackable');
            $table->text('comment');
            $table->integer('rating')->default(5);
            $table->timestamps();
        });
        Schema::create('favorites', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->morphs('favoritable'); // ✅ This already correctly handles type and ID
            $table->timestamps();
        });
        
    }

    public function down()
    {
        Schema::dropIfExists('favorites');
        Schema::dropIfExists('feedback');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('bed_bookings');
        Schema::dropIfExists('room_bookings');
        Schema::dropIfExists('beds');
        Schema::dropIfExists('rooms');
        Schema::dropIfExists('buildings');
        Schema::dropIfExists('sellers');
        Schema::dropIfExists('users');
    }
};
