<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use App\Models\{Subscription, Admin};
use App\Events\Seller\SellerSubscriptionExpiredEvent;
use App\Events\Admin\AdminSubscriptionExpiredEvent;
use App\Notifications\Admin\AdminSubscriptionExpiredNotif;
use App\Notifications\Seller\SellerSubscriptionExpiredNotif;
use Illuminate\Support\Facades\Log;

class CheckForExpiredSubscription extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:check-for-expired-subscription';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $admin = Admin::first();
        $subscriptions = Subscription::where('status', 'active')->get();
        foreach($subscriptions as $subscription) {
            $end = Carbon::parse($subscription->end_date);
            if ($end->isPast()) {
                Log::info('Subscription Expired');
                // $subscription->update(['status' => 'ended']);
                $subscription->seller->notify(new SellerSubscriptionExpiredNotif($subscription));
                $admin->notify(new AdminSubscriptionExpiredNotif($subscription));
                event(new SellerSubscriptionExpiredEvent($subscription));
                event(new AdminSubscriptionExpiredEvent($subscription));
            }
        }
  
    }
}
