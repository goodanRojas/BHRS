<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Building;
class MapController extends Controller
{
    public function index(Building $building)
    {
        $building->load('address');
        return Inertia::render('Seller/Map/SellerMap',[
            'building' => $building,
        ]);
    }
}
