<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use App\Models\{Address, User};
class AddressController extends Controller
{
    public function update(Request $request)
    {
        Log::info($request);
        $validated = $request->validate([
            'address' => ['required', 'array'],
        ]);
      $address =  Address::updateOrCreate(
            [
                // 🔑 Unique key for this user
                'addressable_id' => auth()->id(),
                'addressable_type' => User::class,
            ],
            [
                // ✅ Data to update
                'address' => $validated['address'],
            ]
        );
        Log::info($address);

        return back();
    }
}
