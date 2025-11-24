<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Building;
class Welcome extends Controller
{
    public function index()
    {
        $images = Building::pluck('image')
            ->map(fn($img) => asset('storage/'. $img));
        return Inertia::render(
            'Welcome/Welcome',
            [
                'auth' => auth()->user(),
                'images' => $images
            ]
        );
    }
}
