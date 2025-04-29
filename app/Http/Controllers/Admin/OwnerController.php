<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Seller;
class OwnerController extends Controller
{
    public function index(Request $request)
    {
        
        $owners = Seller::all();

        return inertia('Admin/Owner/Owner', [
            'owners' => $owners,
        ]);
    }

    public function owners(Request $request)
    {
        $owners = Seller::all();
        return response()->json([
            'owners' => $owners,
        ]);
    }
}
