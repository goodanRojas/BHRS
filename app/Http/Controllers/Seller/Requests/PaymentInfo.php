<?php

namespace App\Http\Controllers\Seller\Requests;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{Auth, Log, Hash, Storage};

use App\Models\{OwnerPaymentInfo};

class PaymentInfo extends Controller
{
    public function update(Request $request)
    {
        // dd($request->all());
        $request->validate([
            'gcash_number' => 'required|numeric|digits_between:10,11',
            'qr_code' => 'required|image|max:2048', // adjust rules as needed
        ]);
        $id = auth()->guard('seller')->id();
        $paymentInfo = OwnerPaymentInfo::where('owner_id', $id)->first();

        if ($request->hasFile('qr_code')) {
            // Delete the old QR code file if it exists
            if ($paymentInfo && $paymentInfo->qr_code) {
                // Delete the old QR code file from storage
                Storage::disk('public')->delete('QRcodes/' . $paymentInfo->qr_code);
            }

            // Store the new QR code file (will generate a new unique name)
            $path = $request->file('qr_code')->store('QRcodes', 'public');
            $hashedFileName = basename($path); // Get the new file name
            $qrCode = $hashedFileName; // Set the new QR code filename
        } else {
            // If no new file is uploaded, use the existing one
            $qrCode = $paymentInfo->qr_code; // Use the existing QR code filename
        }

        if (!$paymentInfo) {
            OwnerPaymentInfo::create([
                'owner_id' => $id,
                'gcash_number' => $request->gcash_number,
                'qr_code' => $qrCode,
            ]);
            return redirect()->route('seller.request.index')->with('success', 'Payment information created successfully.');
        } else {
           $paymentInfo->gcash_number = $request->gcash_number;
           $paymentInfo->qr_code = $qrCode;
           $paymentInfo->save();

            return redirect()->route('seller.request.index')->with('success', 'Payment information updated successfully.');
        }
    }
}
