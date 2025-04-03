<?php

namespace App\Http\Controllers\Seller;

use App\Http\Controllers\Controller;
use App\Models\Bed;
use Illuminate\Http\Request;
use Inertia\Inertia;
class BedController extends Controller
{
    public function show(Bed $bed)
    {
        $bed->load('room.building', 'user');
        return Inertia::render('Seller/Beds', [
            'bed' => $bed,
            'room' => $bed->room,
            'building' => $bed->room->building,
        ]);
    }

     
}
