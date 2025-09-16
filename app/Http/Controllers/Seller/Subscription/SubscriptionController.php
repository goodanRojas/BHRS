<?php

namespace App\Http\Controllers\Seller\Subscription;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Models\{Subscription, SubscriptionPlan, Admin, AdminPaymentInfo};

class SubscriptionController extends Controller
{
    public function landing()
    {
        $plans = SubscriptionPlan::all();
        $pending = Subscription::where("seller_id", auth()->guard('seller')->user()->id)
            ->where('status', 'pending')
            ->first();
        return Inertia::render('Seller/Subscription/Landing', [
            'plans' => $plans,
            'pending' => $pending,
        ]);
    }

    /**
     * Show available subscription plans
     */
    public function choose(SubscriptionPlan $plan)
    {
        $admin = Admin::first();
        $paymentInfo = $admin->paymentInfo;

        return Inertia::render('Seller/Subscription/ChoosePlan', [
            'selectedPlan' => $plan,
            'paymentInfo' => $paymentInfo,
        ]);
    }

    /**
     * Store subscription request (semi-manual)
     */
    public function store(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|exists:subscription_plans,id',
            'receipt' => 'required|image|max:2048',
            'remarks' => 'nullable|string',
            'reference_number' => 'nullable|string',
        ]);

        $path = $request->file('receipt')->store('receipts', 'public');

        $subscription = Subscription::create([
            'seller_id' => auth()->guard('seller')->user()->id,
            'plan_id' => $request->plan_id,
            'start_date' => now(),
            'end_date' => now()->addDays(SubscriptionPlan::find($request->plan_id)->duration_days),
            'status' => 'pending', // admin must approve
            'active' => false,
            'seller_receipt_path' => $path,
            'seller_ref_num' => $request->reference_number,
            'seller_remarks' => $request->remarks,
        ]);

        return redirect()->route('seller.subscription.pending');
    }

    /**
     * Show expired page
     */
    public function expired()
    {
        return Inertia::render('Seller/Subscription/Expired');
    }

    /**
     * Show pending approval page
     */
    public function pending()
    {
        return Inertia::render('Seller/Subscription/Pending');
    }

    public function upgrade()
    {
        $owner = auth()->guard('seller')->user();

        $currentPlan = Subscription::with('plan')
            ->where('seller_id', $owner->id)
            ->latest('created_at')
            ->where('status', 'active')
            ->first();
        $plans = SubscriptionPlan::all();
        $paymentInfo = AdminPaymentInfo::first();
        return Inertia::render('Seller/Subscription/Upgrade', [
            'currentPlan' => $currentPlan,
            'plans' => $plans,
            'paymentInfo' => $paymentInfo

        ]);
    }

    public function chooseUpgrade(SubscriptionPlan $plan)
    {
        $paymentInfo = AdminPaymentInfo::first();
        $plan->load('subscriptions');

        return inertia('Seller/Subscription/ChooseUpgrade', [
            'plan' => $plan,
            'paymentInfo' => $paymentInfo
        ]);


    }

    public function storeUpgrade(Request $request)
    {
        // dd($request->all());
        $owner = auth()->guard('seller')->user();

        $currentSubscription = Subscription::with('plan')
            ->where('seller_id', $owner->id)
            ->where('status', 'active')
            ->first();
        $currentSubscription->status = 'paused'; //if the user upgrades. Just pause the current subscription
        $currentSubscription->save();
        if($request->hasFile('receipt'))
        {
            $path = $request->file('receipt')->store('receipts', 'public');
        }
        Subscription::create([
            'seller_id' => $owner->id,
            'plan_id' => $request->plan_id,
            'start_date' => now(),
            'end_date' => now()->addDays(SubscriptionPlan::find($request->plan_id)->duration_days),
            'status' => 'pending', // admin must approve
            'active' => false,
            'seller_receipt_path' => $path,
            'seller_ref_num' => $request->reference_number,
            'seller_remarks' => $request->remarks,
        ]);

        return redirect()->route('seller.subscription.pending',[
            'message' => 'Your subscription has been upgraded. Please wait for admin approval.',
            'type' => 'success'
        ]);
        
    }
}
