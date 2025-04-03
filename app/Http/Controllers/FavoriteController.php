<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use Illuminate\Http\Request;
use Inertia\Inertia;

class FavoriteController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user(); // Get the authenticated user

        // Get the authenticated user's favorites along with related room and building data
        $favorites = Favorite::with(['room.building', 'room.feedbacks', 'user', 'bed', 'bed.feedbacks'])->where('user_id', $user->id)->get();

        return Inertia::render('Home/Favorites', [
            'favorites' => $favorites,
        ]);
    }
}
