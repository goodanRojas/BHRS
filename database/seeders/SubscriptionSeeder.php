<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\{Seller, SubscriptionPlan};
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class SubscriptionSeeder extends Seeder
{
    public function run()
    {
        $statuses = ['active', 'paused', 'pending', 'rejected', 'ended', 'canceled'];

        // Get all existing sellers and plans
        $sellers = Seller::pluck('id')->toArray();
        $plans = SubscriptionPlan::pluck('id')->toArray();

        if (empty($sellers) || empty($plans)) {
            $this->command->error('No sellers or subscription plans found. Please seed them first.');
            return;
        }

        $sellerIndex = 0;

        foreach ($statuses as $status) {
            for ($i = 0; $i < 3; $i++) {
                // Loop through sellers cyclically
                $sellerId = $sellers[$sellerIndex % count($sellers)];
                $sellerIndex++;

                // Random plan for the subscription
                $planId = $plans[array_rand($plans)];

                DB::table('subscriptions')->insert([
                    'seller_id' => $sellerId,
                    'plan_id' => $planId,
                    'start_date' => Carbon::now()->subDays(rand(0, 30))->toDateString(),
                    'end_date' => Carbon::now()->addDays(rand(30, 60))->toDateString(),
                    'active' => $status === 'active' ? 1 : 0,
                    'status' => $status,
                    'seller_receipt_path' => "receipts/{$status}{$i}.jpg",
                    'seller_ref_num' => 'REF' . rand(1000, 9999),
                    'seller_remarks' => "Test {$status}",
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        $this->command->info('Subscription seeder ran successfully!');
    }
}
