<?php

namespace App\Http\Controllers;

use App\Models\Favorite;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use App\Events\Favorite\FavoriteToggled;

class FavoriteController extends Controller
{

    public function index(Request $request)
    {
        $user = $request->user();

        // Get the authenticated user's favorites with their polymorphic related models
        $favorites = Favorite::with('favoritable')->where('user_id', $user->id)->get();

        $formattedFavorites = [];

        foreach ($favorites as $favorite) {
            $item = $favorite->favoritable;

            if ($item instanceof \App\Models\Room) {
                $formattedFavorites[] = [
                    'type' => 'room',
                    'room' => $item,
                    'building' => $item->building,
                ];
            }

            if ($item instanceof \App\Models\Bed) {
                $room = $item->room;
                $formattedFavorites[] = [
                    'type' => 'bed',
                    'bed' => $item,
                    'room' => $room,
                    'building' => $room->building ?? null,
                ];
            }
        }

        return Inertia::render('Home/Favorites', [
            'favorites' => $formattedFavorites,
        ]);
    }



    public function toggleFavorite($id, Request $request)
    {
        // Get the authenticated user
        $user = $request->user();

        // Find the bed or room (favoritable item) by id
        $favoritable = \App\Models\Bed::find($id) ?: \App\Models\Room::find($id);
        Log::info($id);
        if (!$favoritable) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        // Check if the user already favorited this item
        $favorite = Favorite::where('user_id', $user->id)
            ->where('favoritable_id', $favoritable->id)
            ->where('favoritable_type', get_class($favoritable))
            ->first();
        $favoriteCount = Favorite::where('user_id', $user->id)
            ->where('favoritable_type', get_class($favoritable))
            ->count();

        if ($favorite) {
            // If it exists, remove the favorite
            $favorite->delete();
            $userId = $user->id;
            broadcast(new FavoriteToggled( $favoriteCount,$userId ))->toOthers();
            return response()->json(['message' => 'Favorite removed']);
        } else {
            // If it doesn't exist, add it as a favorite
            Favorite::create([
                'user_id' => $user->id,
                'favoritable_id' => $favoritable->id,
                'favoritable_type' => get_class($favoritable),
            ]);
            return response()->json(['message' => 'Favorite updated']);
        }
    }
}
