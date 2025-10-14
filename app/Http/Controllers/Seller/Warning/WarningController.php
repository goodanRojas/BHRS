<?php

namespace App\Http\Controllers\Seller\Warning;

use App\Http\Controllers\Controller;
use App\Models\OwnerPaymentInfo;
use Illuminate\Http\Request;

class WarningController extends Controller
{
    public function checkWarning()
    {
        $id = auth('seller')->id();
        $showWarning = false;
        $paymentInfo =OwnerPaymentInfo::where('owner_id', $id)->first();
        if (!$paymentInfo) {
            $showWarning = true;
        }
        return response()->json(['showWarning' => $showWarning]);
    }
}
