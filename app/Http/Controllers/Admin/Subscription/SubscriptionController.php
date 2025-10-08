<?php

namespace App\Http\Controllers\Admin\Subscription;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\{Subscription, SubscriptionPlan};
use Illuminate\Support\Facades\Log;
use App\Events\Seller\SubscriptionConfirmedEvent;
use App\Notifications\Seller\{SubscriptionConfirmedNotif, SubscriptionRejectedNotif};
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

    public function confirm(Request $request)
    {
        Log::info($request);
        $validated = $request->validate([
            'subscription_id' => 'required|exists:subscriptions,id',
            'receipt' => 'required|image|max:2048',
            'remarks' => 'nullable|string',
            'reference_number' => 'nullable|string',
        ]);

        $subscription = Subscription::findOrFail($validated['subscription_id']);
        // Update subscription fields
        $subscription->status = 'active';
        $subscription->admin_ref_num = $validated['reference_number'] ?? null;
        $subscription->admin_remarks = $validated['remarks'] ?? null;

        // Handle file upload
        if ($request->hasFile('receipt')) {
            $filePath = $request->file('receipt')->store('receipts', 'public');
            $subscription->admin_receipt_path = $filePath;
        }

        $subscription->save();
        $seller = $subscription->seller;
        $subscription->load('plan', 'seller');
        $seller->notify(new SubscriptionConfirmedNotif($subscription));
        event(new SubscriptionConfirmedEvent($subscription));
        return redirect()->route('admin.subscriptions.index')
            ->with('success', 'Subscription has been confirmed successfully!');
    }

    // Reject subscription
    public function reject(Subscription $subscription)
    {
        $subscription->status = 'canceled';
        $subscription->save();
        $subscription->load('plan', 'seller');
        $seller = $subscription->seller;
        $seller->notify(new SubscriptionRejectedNotif($subscription));

        return redirect()->route('admin.subscriptions.cancelled', $subscription)
            ->with('success', 'Subscription has been rejected and moved to cancelled!');
    }

}
