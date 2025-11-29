<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\{OwnerPaymentInfo, Seller, AdminLog};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Log, Storage};
use Inertia\Inertia;

class PaymentDetailsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $id = auth()->guard('seller')->user()->id;
        $paymentInfo = OwnerPaymentInfo::where('owner_id', $id)->first();
        return Inertia::render('Seller/PaymentDetails/Index', [
            'paymentInfo' => $paymentInfo,
        ]);
    }


    public function save(Request $request)
    {
        Log::info('Payment details stored', [
            'data' => $request->all(),
        ]);

        $id = auth()->guard('seller')->user()->id;

        $validated = $request->validate([
            'gcash_name' => 'nullable|string|max:255',
            'gcash_number' => 'nullable|string|max:20',
            'qr_code' => 'nullable|image|max:2048',
        ]);

        // Create or update name/number
        $paymentInfo = OwnerPaymentInfo::updateOrCreate(
            ['owner_id' => $id],
            [
                'gcash_name' => $validated['gcash_name'] ?? null,
                'gcash_number' => $validated['gcash_number'] ?? null,
            ]
        );

        // Handle QR upload separately
        if ($request->hasFile('qr_code')) {
            // remove old file if exists
            if ($paymentInfo->qr_code && Storage::disk('public')->exists($paymentInfo->qr_code)) {
                Storage::disk('public')->delete($paymentInfo->qr_code);
            }

            $path = $request->file('qr_code')->store('qr-codes', 'public');
            $paymentInfo->update(['qr_code' => $path]);
        }

        AdminLog::create([
            'actor_type' => Seller::class,
            'actor_id' => auth('seller')->user()->id,
            'name' => auth('seller')->user()->name,
            'activity' => 'Updated Payment Details',
        ]);
        return redirect()->back()->with('success', 'Payment details saved successfully.');
    }

}
