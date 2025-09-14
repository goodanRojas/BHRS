<?php

namespace App\Http\Controllers\Seller\Subscription;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\{Subscription, SubscriptionPlan};

class SubscriptionController extends Controller
{
    public function landing()
    {
        $plans = SubscriptionPlan::all();
        $pending = Subscription::where("seller_id", auth()->guard('seller')->user()->id)
        ->where('status' ,'pending')
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
        $admin = auth()->guard('admin')->user();
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
}
