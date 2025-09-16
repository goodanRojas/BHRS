<?php

namespace App\Http\Middleware\Seller;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
use App\Models\Subscription;
class CheckPendingSubscription
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $sellerId = Auth::guard('seller')->id();

        // Check if there is a pending subscription
        $subscription = Subscription::where('seller_id', $sellerId)
            ->where('status', ['active', 'pending'])
            ->where(function ($q) {
                $q->whereNull('end_date')->orWhere('end_date', '>', now());
            })
            ->latest('created_at')
            ->first();
        if ($subscription->status === "pending") {
            // Redirect to pending page or landing with a notice
            return redirect()->route('seller.subscription.pending')
                ->with('message', 'You already have a pending subscription. Please wait for admin approval.');
        }
        else if($subscription->status === "active") {
            return redirect()->route('seller.subscription.landing')
                ->with('message', 'You already have a subscription.');
        }

        return $next($request);
    }
}
