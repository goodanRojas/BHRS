<?php

namespace App\Http\Middleware\Seller;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Log;
class CheckSubscriptionFeature
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$plan): Response
    {
        $owner = auth()->guard('seller')->user();

        // Case 0: Not logged in
        if (!$owner) {
            return redirect()->route('seller.login.index');
        }

        // Get the latest valid subscription (adjust sorting logic if needed)
        $subscription = $owner->subscriptions()
            ->latest('created_at') // or maybe order by end_date
            ->first();
        Log::info($subscription);


        // Case 1: No subscription at all (new seller)
        if (!$subscription) {
            return redirect()->route('seller.subscription.landing');
        }

        // Case 2: Subscription pending approval
        if ($subscription->status === 'pending') {
            return redirect()->route('seller.subscription.pending')
                ->with('message', 'Your subscription is pending approval. Please wait.');
        }

        // Case 3: Subscription canceled or paused
        if (in_array($subscription->status, ['canceled', 'paused']) /* || !$subscription->active */) {
            return redirect()->route('seller.subscription.landing')
                ->with('message', 'Your subscription is not active. Please renew or contact admin.');
        }

        // Case 4: Subscription expired
        if ($subscription->end_date && $subscription->end_date->isPast()) {
            return redirect()->route('seller.subscription.expired')
                ->with('message', 'Your subscription has expired. Please renew or contact admin.');
        }

        // Case 5: Feature not included in plan
        if (!$owner->hasPlan($plan)) {
            return redirect()->route('seller.subscription.upgrade')
                ->with('message', 'Your current plan does not support this feature. Please upgrade.');

        }

        // Case 6: Feature not included in plan

        return $next($request);
    }

}
