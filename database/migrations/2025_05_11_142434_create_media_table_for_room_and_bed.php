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
        Schema::create('media', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('imageable_id');  // polymorphic ID
            $table->string('imageable_type');             // polymorphic type (e.g., 'App\Models\Room')
            $table->string('file_path');                  // the actual file path or URL (e.g., for images)
            $table->string('alt_text')->nullable();       // optional alt text for images (for accessibility)
            $table->integer('order')->nullable();         // optional: order in gallery/carousel
            $table->timestamps();                         // created_at, updated_at timestamps

            // Optional: index for performance (if you're doing a lot of queries on these fields)
            $table->index(['imageable_id', 'imageable_type']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('media');
    }
};
