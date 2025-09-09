<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\{Booking, Rating, Comment};
use Illuminate\Support\Facades\Log;

class FeedbackController extends Controller
{
    public function show($booking)
    {
        $booking = Booking::with('bookable.room.building.seller')->find($booking);
        $rating = Rating::where('booking_id', $booking->id)->first();
        $comments = Comment::where('user_id', auth()->user()->id)->get();
        return Inertia::render('Home/Accommodation/History', [
            'booking' => $booking,
            'rating' => $rating,
            'comments' => $comments,
        ]);
    }


    public function rate(Request $request, Booking $booking)
    {
        Log::info("Trying to rate");
        Log::info($request->all());
        $validated = $request->validate([
            'stars' => 'required|integer|min:1|max:5',
        ]);
        Log::info($validated);

        // Only one rating per booking per user
        $booking->ratings()->updateOrCreate(
            ['user_id' => auth()->id()],
            ['stars' => $request->stars]
        );
        return response()->json(['message' => 'Rating submitted.']);
    }

    public function comment(Request $request, Booking $booking)
    {
        $request->validate([
            'comment' => 'required|string|max:1000',
        ]);

       $comment = Comment::Create([
            'user_id' => auth()->id(),
            'booking_id' => $booking->id,
            'body' => $request->comment,
            'edited' => null
        ]);

         return response()->json($comment);
    }

    public function editComment(Request $request, $id)
    {
        $comment = Comment::findOrFail($id);
        if (!is_null($comment->edited)) {
            return response()->json([
                'message' => 'This comment was already edited and cannot be edited again.'
            ], 422);
        }

        $validated = $request->validate([
            'body' => 'required|string|max:1000',
        ]);

        // Store the original body in `edited` (text) and replace `body` with the new one
        $comment->update([
            'edited' => $comment->body,       // keep original text here
            'body'   => $validated['body'],   // new text
        ]);
        return response()->json([
            'comment' => $comment->fresh(),
        ]);
    }

    public function destroy(Comment $comment)
    {
        $comment->delete(); // soft delete if model uses SoftDeletes

        return response()->json([
            'message' => 'Comment deleted successfully.'
        ], 200);
    }
}
