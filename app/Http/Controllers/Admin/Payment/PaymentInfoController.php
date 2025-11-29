<?php

namespace App\Http\Controllers\Admin\Payment;

use App\Http\Controllers\Controller;
use App\Models\{AdminPaymentInfo, Admin, AdminLog};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Storage, Log};

class PaymentInfoController extends Controller
{
    public function index()
    {
        $admin = auth()->guard('admin')->user();
        $paymentInfo = $admin->paymentInfo;
        return inertia("Admin/Payment/Index", [
            'paymentInfo' => $paymentInfo,
        ]);
    }

    public function store(Request $request)
    {
        $admin = auth()->guard('admin')->user();

        $validated = $request->validate([
            'gcash_name' => 'required|string',
            'gcash_number' => 'required|string',
            'qr_code' => 'nullable|image|mimes:jpeg,png,jpg,svg,gif,webp',
        ]);

        if ($request->hasFile('qr_code')) {
            $filePath = $request->file('qr_code')->store('qr_codes', 'public');
            $validated['qr_code'] = $filePath;
        }

        AdminPaymentInfo::updateOrCreate([
            'admin_id' => $admin->id,
            'gcash_name' => $validated['gcash_name'],
            'gcash_number' => $validated['gcash_number'],
            'qr_code' => $validated['qr_code'],
        ]);

        AdminLog::create([
            'actor_type' => Admin::class,
            'actor_id' => auth()->guard('admin')->id(),
            'name' => auth()->guard('admin')->user()->name,
            'activity' => 'Created payment info for admin ID: ' . $admin->id
        ]);

        return back()->with('message', 'Payment info created successfully.');

    }

    public function update(Request $request, $payment_info)
    {
        $paymentInfo = AdminPaymentInfo::find($payment_info);
        $validated = $request->validate([
            'gcash_name' => 'required|string',
            'gcash_number' => 'required|string',
            'qr_code' => 'nullable|image|mimes:jpeg,png,jpg,svg,gif,webp',
        ]);

        if ($request->hasFile('qr_code')) {
            if ($paymentInfo->qr_code && Storage::disk('public')->exists($paymentInfo->qr_code)) {
                Storage::disk('public')->delete($paymentInfo->qr_code);
            }

            $filePath = $request->file('qr_code')->store('qr_codes', 'public');
            $validated['qr_code'] = $filePath;
        } else {
            $validated['qr_code'] = $paymentInfo->qr_code;
        }
        $paymentInfo->update([
            'gcash_name' => $validated['gcash_name'],
            'gcash_number' => $validated['gcash_number'],
            'qr_code' => $validated['qr_code'],
        ]);

        AdminLog::create([
            'actor_type' => Admin::class,
            'actor_id' => auth()->guard('admin')->id(),
            'name' => auth()->guard('admin')->user()->name,
            'activity' => 'Updated payment info for admin ID: ' . $paymentInfo->admin_id
        ]);

        return back()->with('message', 'Payment info updated successfully.');
    }
}
