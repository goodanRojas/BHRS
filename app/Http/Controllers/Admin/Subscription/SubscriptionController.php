<?php

namespace App\Http\Controllers\Admin\Subscription;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\{Subscription, SubscriptionPlan};
class SubscriptionController extends Controller
{
    public function index()
    {
        $subscriptions = Subscription::with(['plan', 'seller'])->where('status', 'active')->get();
        return inertia('Admin/Owner/Subscription/Index', [
            'subscriptions' => $subscriptions,
        ]);
    }
    public function show(Subscription $subscription)
    {
        $subscription->load(['plan', 'seller']);
        return inertia('Admin/Owner/Subscription/Show', [
            'subscription' => $subscription,
        ]);
    }

    public function cancelled()
    {
        $subscriptions = Subscription::with(['plan', 'seller'])
            ->whereNotIn('status', ['active', 'pending'])
            ->get();
        return inertia('Admin/Owner/Subscription/Cancelled', [
            'subscriptions' => $subscriptions,
        ]);
    }

    public function pending()
    {
        $subscriptions = Subscription::with(['plan', 'seller'])->where('status', 'pending')->get();
        return inertia('Admin/Owner/Subscription/Pending', [
            'subscriptions' => $subscriptions,
        ]);
    }

    public function showPending(Subscription $subscription)
    {
        $subscription->load(['plan', 'seller']);
        return inertia('Admin/Owner/Subscription/ShowPending', [
            'subscription' => $subscription,
        ]);
    }
    public function showCancelled(Subscription $subscription)
    {
        $subscription->load(['plan', 'seller']);
        return inertia('Admin/Owner/Subscription/ShowCancelled', [
            'subscription' => $subscription,
        ]);
    }

    public function confirm(Subscription $subscription)
    {
        $subscription->status = 'active';
        $subscription->save();

        return redirect()->route('admin.subscriptions.index')
            ->with('success', 'Subscription has been confirmed successfully!');
    }

    // Reject subscription
    public function reject(Subscription $subscription)
    {
        $subscription->status = 'canceled';
        $subscription->save();

        return redirect()->route('admin.subscriptions.cancelled', $subscription)
            ->with('success', 'Subscription has been rejected and moved to cancelled!');
    }

}
