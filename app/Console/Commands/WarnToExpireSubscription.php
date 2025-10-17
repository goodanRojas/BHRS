<?php

namespace App\Console\Commands;

use App\Events\Seller\WarningSubscriptionToExpireEvent;
use Illuminate\Console\Command;
use App\Models\Subscription;
use App\Notifications\Seller\WarningSubscriptionToExpireNotif;
use Carbon\Carbon;
use Illuminate\Support\Facades\Log;
class WarnToExpireSubscription extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:warn-to-expire-subscription';

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
        $subscriptions = Subscription::where('warned', null)->get();
        foreach ($subscriptions as $subscription) {
            $start = Carbon::parse($subscription->start_date);
            $end = Carbon::parse($subscription->end_date);
            if (now()->lessThanOrEqualTo($end) && now()->diffInDays($end, false) <= 3) {
                Log::info('subscription expired: ' . $subscription->id);
                $subscription->update(['warned' => now()]);
                $subscription->user->notify(new WarningSubscriptionToExpireNotif($subscription));
                event(new WarningSubscriptionToExpireEvent($subscription)); // Broadcast to User
            }
        }
    }
}
