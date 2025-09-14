<?php

namespace App\Http\Controllers\Admin\Payment;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

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
}
