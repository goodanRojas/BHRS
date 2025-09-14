<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            // Drop old `plan` column if it exists
            if (Schema::hasColumn('subscriptions', 'plan')) {
                $table->dropColumn('plan');
            }
            // Add proper foreign key to subscription_plans
            $table->foreignId('plan_id')
                ->after('seller_id')
                ->constrained('subscription_plans')
                ->cascadeOnDelete();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropForeign(['plan_id']);
            $table->dropColumn('plan');

            // Restore old column if needed
            $table->string('plan')->nullable();
        });
    }
};
