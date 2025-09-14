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
        /*             'seller_receipt_path' => $path,
            'seller_ref_num' => $request->reference_number,
            'seller_remarks' => $request->remarks,
 */
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->string('seller_receipt_path')->nullable()->after('status');
            $table->string('seller_ref_num')->nullable()->after('seller_receipt_path');
            $table->string('seller_remarks')->nullable()->after('seller_ref_num');
            $table->string('admin_receipt_path')->nullable()->after('seller_remarks');
            $table->string('admin_ref_num')->nullable()->after('admin_receipt_path');
            $table->string('admin_remarks')->nullable()->after('admin_ref_num');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('subscriptions', function (Blueprint $table) {
            $table->dropColumn('seller_receipt_path');
            $table->dropColumn('seller_ref_num');
            $table->dropColumn('seller_remarks');
            $table->dropColumn('admin_receipt_path');
            $table->dropColumn('admin_ref_num');
            $table->dropColumn('admin_remarks');
        });
    }
};
