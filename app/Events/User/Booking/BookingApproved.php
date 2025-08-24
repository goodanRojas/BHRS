<?php

namespace App\Events\User\Booking;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use App\Models\Booking;

class BookingApproved implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public $booking;
    public function __construct(Booking $booking)
    {
        $this->booking = $booking;
        Log::info("Booking approved event created");
    }

    public function broadcastAs()
    {
        return "UserBookingApproved";
    }
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user_booking_approved.'. $this->booking->user_id),
        ];
    }
}
