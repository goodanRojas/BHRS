<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\OwnerPaymentInfo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Log};
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
            'gcash_name'   => 'nullable|string|max:255',
            'gcash_number' => 'nullable|string|max:20',
            'gcash_qr'     => 'nullable|image|max:2048',
        ]);

        $paymentInfo = OwnerPaymentInfo::where('owner_id', $id)->first();

        // If a new QR code is uploaded, store it
        if ($request->hasFile('gcash_qr')) {
            $validated['gcash_qr'] = $request->file('gcash_qr')->store('qrcodes', 'public');
        } else {
            unset($validated['gcash_qr']); // avoid overwriting with null
        }

        if ($paymentInfo) {
            // Update only the fields that are present in the request
            foreach ($validated as $key => $value) {
                if ($value !== null && $value !== '') {
                    $paymentInfo->{$key} = $value;
                }
            }
            $paymentInfo->save();
        } else {
            // Create new record with only provided values
            $validated['owner_id'] = $id;
            OwnerPaymentInfo::create($validated);
        }

        return redirect()->back()->with('success', 'Payment details saved successfully.');
    }
}
