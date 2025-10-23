<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Events\Favorite\FavoriteToggled;
use App\Models\{Bed};
class FavoriteController extends Controller
{

    public function index(Request $request)
    {
        $user = $request->user();

        $favorites = Favorite::with([
            'favoritable',
            'favoritable.room:id,name,building_id', // eager load room with its building_id
            'favoritable.room.building:id,name',    // eager load building from room
            'favoritable.bookings' => function ($query) {
                $query->where('status', 'completed');
            }
        ])->where('user_id', $user->id)->get();


        return Inertia::render('Home/Favorites', [
            'favorites' => $favorites,
        ]);
    }



    public function toggleFavorite($id, Request $request)
    {
        // Get the authenticated user
        $user = $request->user();


        // Check if the user already favorited this item
        $favorite = Favorite::where('user_id', $user->id)
            ->where('favoritable_id', $id)
            ->where('favoritable_type', Bed::class)
            ->first();
        $favoriteCount = Favorite::where('user_id', $user->id)
            ->where('favoritable_type', Bed::class)
            ->count();

        if ($favorite) {
            // If it exists, remove the favorite
            $favorite->delete();
            $userId = $user->id;
            broadcast(new FavoriteToggled($favoriteCount, $userId))->toOthers();
            return response()->json(['message' => 'Favorite removed']);
        } else {
            // If it doesn't exist, add it as a favorite
            Favorite::create([
                'user_id' => $user->id,
                'favoritable_id' => $id,
                'favoritable_type' => Bed::class,
            ]);
            return response()->json(['message' => 'Favorite updated']);
        }
    }
}
