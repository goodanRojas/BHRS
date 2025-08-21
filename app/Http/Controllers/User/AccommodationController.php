<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Models\Feedback;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use App\Models\Bed;
use App\Models\Room;

class AccommodationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $booking = Booking::whereIn('status', ['approved', 'waiting', 'pending', 'paid', 'completed'])
            ->where('user_id', auth()->id())
            ->with([
                'bookable' => function ($morphTo) {
                    $morphTo->morphWith([
                        Bed::class => [
                            'room' => function ($query) {
                                $query->select(['id', 'name', 'building_id'])
                                    ->with(['building' => function ($query) {
                                $query->select(['id', 'name', 'seller_id'])->with(['address', 'seller']);
                                    }]);
                            },
                            'feedbacks' => function ($query) {
                                $query->select( 'rating'); // adjust if necessary
                            },
                        ],
                        Room::class => [
                            'building' => function ($query) {
                                $query->select(['id', 'name', 'seller_id'])->with(['address', 'seller']);
                                
                            },
                            'feedbacks' => function ($query) {
                                $query->select( 'rating'); // adjust if necessary
                            },
                        ],
                        // add other morph types if any
                    ]);
                }
            ])
            ->first();

        return Inertia::render('Home/Accommodation/Dashboard', [
            'booking' => $booking,
        ]);
    }

    public function showHistory(Request $request)
    {
        $userId = auth()->id();

        // Function to retrieve completed bookings with payment and feedbacks
        $getHistoryData = function ($model) use ($userId) {
            return $model::whereHas('bookings', function ($query) use ($userId) {
                $query->where('status', 'completed')
                    ->whereHas('payment', function ($q) use ($userId) {
                        $q->where('status', 'completed')
                            ->where('user_id', $userId);
                    });
            })
                ->with([
                    'bookings' => function ($query) {
                        $query->where('status', 'completed')
                            ->whereHas('payment', function ($q) {
                                $q->where('status', 'completed');
                            })
                            ->with(['payment:id,booking_id,payment_method,receipt,amount']);
                    },
                    'feedbacks' => function ($query) use ($userId) {
                        $query->where('user_id', $userId)
                            ->orderBy('created_at', 'desc');
                    }
                ])
                ->withAvg('feedbacks', 'rating')
                ->get();
        };

        // Get history data for beds and rooms
        $beds = $getHistoryData(Bed::class);
        $rooms = $getHistoryData(Room::class);

        return Inertia::render('Home/Accommodation/Histories', [
            'beds' => $beds,
            'rooms' => $rooms,
        ]);
    }


    public function showCancelled(Request $request)
    {
        $beds = Bed::whereHas('bookings', function ($query) {
            $query->whereIn('status', ['cancelled', 'rejected'])
                ->where('user_id', auth()->id());
        })
            ->with([
                'bookings' => function ($query) {
                    $query->whereIn('status', ['cancelled', 'rejected'])
                        ->where('user_id', auth()->id());
                },
                'room' => function ($query) {
                    $query->select(['name', 'id', 'building_id']);
                },
                'room.building' => function ($query) {
                    $query->select(['name', 'id',]);
                },
                'room.building.address'
            ])
            ->withAvg('feedbacks', 'rating')
            ->get();


        $rooms = Room::whereHas('bookings', function ($query) {
            $query->whereIn('status', ['cancelled', 'rejected'])
                ->where('user_id', auth()->id());
        })
            ->with([
                'bookings' => function ($query) {
                    $query->whereIn('status', ['cancelled', 'rejected'])
                        ->where('user_id', auth()->id());
                },
                'building' => function ($query) {
                    $query->select('name');
                },
                'building.address'
            ])
            ->withAvg('feedbacks', 'rating')
            ->get();

        return Inertia::render('Home/Accommodation/Cancelled', [
            'beds' => $beds,
            'rooms' => $rooms,
        ]);
    }

    public function storeFeedback(Request $request, $type, $id)
    {
        // Validate the incoming request data
        $validated = $request->validate([
            'rating' => 'required|integer|between:1,5',
            'feedback' => 'nullable|string|max:1000',
        ]);

        // Find the correct model based on the type (bed or room)
        if ($type == 'bed') {
            $accommodation = Bed::findOrFail($id);
        } elseif ($type == 'room') {
            $accommodation = Room::findOrFail($id);
        } else {
            return response()->json(['error' => 'Invalid accommodation type'], 400);
        }

        // Store the feedback
        $feedback = new Feedback();
        $feedback->user_id = Auth::id(); // Store the authenticated user's ID
        $feedback->rating = $validated['rating'];
        $feedback->comment = $validated['feedback'];

        // Relate feedback to the accommodation
        if ($type == 'bed') {
            $accommodation->feedbacks()->save($feedback);
        } elseif ($type == 'room') {
            $accommodation->feedbacks()->save($feedback);
        }

        // Return a success response
        return response()->json(['message' => 'Feedback submitted successfully!'], 200);
    }


    public function show(Request $request, $id)
    {
        $userId = auth()->id();
        $details = Booking::with(['bed.room.building.seller'])
            ->where('id', $id)
            ->firstOrFail();
        $count = Booking::where('user_id', $userId)->where('status', 'completed')->count();
        return Inertia::render('Home/Accommodation/Bed', ['bed' => $details, 'count' => $count]);
    }


    public function store(Request $request)
    {
        $request->validate([
            'comment' => 'required|string|max:500',
            'rating' => 'required|integer|min:1|max:5',
            'booking_id' => 'required|exists:bed_bookings,id',
        ]);

        Feedback::create(
            [
                'user_id' => Auth::id(),
                'booking_id' => $request->booking_id,
                'comment' => $request->comment,
                'rating' => $request->rating,
            ]
        );

        return back()->with('success', 'Feedback submitted successfully!');
    }
}
