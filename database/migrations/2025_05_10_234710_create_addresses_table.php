<?php
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateAddressesTable extends Migration
{
    public function up(): void
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->id();

            // Foreign key to users or other entities (optional)
            $table->foreignId('user_id')->nullable()->constrained()->onDelete('cascade');

            // Address components
            $table->string('street')->nullable();
            $table->string('barangay')->nullable();   // Optional if you're in the Philippines
            $table->string('city');
            $table->string('province');
            $table->string('postal_code')->nullable();
            $table->string('country')->default('Philippines');

            // Timestamps
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
}
