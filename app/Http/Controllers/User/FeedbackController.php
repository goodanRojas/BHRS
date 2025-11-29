<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\{Booking, Rating, Comment, User, AdminLog};
use Illuminate\Support\Facades\Log;

class FeedbackController extends Controller
{
    public function show($booking)
    {
        $booking = Booking::with(['bookable.room.building.seller', 'bookable.images'])->find($booking);
        $rating = Rating::where('booking_id', $booking->id)->first();
        $comments = Comment::where('booking_id', auth()->user()->id)->get();
        return Inertia::render('Home/Accommodation/History', [
            'booking' => $booking,
            'rating' => $rating,
            'comments' => $comments,
        ]);
    }


    public function rate(Request $request, Booking $booking)
    {
        $user = auth()->user();
        $validated = $request->validate([
            'stars' => 'required|integer|min:1|max:5',
        ]);
        // Only one rating per booking per user
        $booking->ratings()->updateOrCreate(
            ['user_id' => auth()->id()],
            ['stars' => $request->stars]
        );
        $booking->update(['is_rated' => true,]);
        AdminLog::create([
            'actor_type' => User::class,
            'actor_id' => $user->id,
            'name' => $user->name,
            'activity' => 'Rated a booking',
        ]);
        return response()->json(['message' => 'Rating submitted.']);
    }

    public function comment(Request $request, Booking $booking)
    {
        $user = auth()->user();
        $request->validate([
            'comment' => 'required|string|max:1000',
            'anonymous' => 'required|boolean',
        ]);

        $comment = Comment::Create([
            'user_id' => auth()->id(),
            'booking_id' => $booking->id,
            'body' => $request->comment,
            'anonymous' => $request->anonymous,
            'edited' => null
        ]);
        AdminLog::create([
            'actor_type' => User::class,
            'actor_id' => $user->id,
            'name' => $user->name,
            'activity' => 'Commented on a booking',
        ]);
        return response()->json($comment);
    }

    public function editComment(Request $request, $id)
    {
        $user = auth()->user();
        $comment = Comment::findOrFail($id);
        if (!is_null($comment->edited)) {
            return response()->json([
                'message' => 'This comment was already edited and cannot be edited again.'
            ], 422);
        }

        $validated = $request->validate([
            'body' => 'required|string|max:1000',
            'anonymous' => 'boolean|required'
        ]);

        // Store the original body in `edited` (text) and replace `body` with the new one
        $comment->update([
            'edited' => $comment->body,       // keep original text here
            'body' => $validated['body'],   // new text
            'anonymous' => $validated['anonymous']
        ]);

        AdminLog::create([
            'actor_type' => User::class,
            'actor_id' => $user->id,
            'name' => $user->name,
            'activity' => 'Updated a comment',
        ]);
        return response()->json([
            'comment' => $comment->fresh(),
        ]);
    }

    public function destroy(Comment $comment)
    {
        $comment->delete(); // soft delete if model uses SoftDeletes
        AdminLog::create([
            'actor_type' => User::class,
            'actor_id' => auth()->id(),
            'name' => auth()->user()->name,
            'activity' => 'Deleted a comment',
        ]);
        return response()->json([
            'message' => 'Comment deleted successfully.'
        ], 200);
    }
}
