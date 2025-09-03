<?php

namespace App\Events\User\Booking;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Support\Facades\Log;
use Illuminate\Queue\SerializesModels;
use App\Models\Booking;
class BookingEndedEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public $booking;
    public function __construct(Booking $booking)
    {
        $this->booking = $booking;
        Log::info("Expired event from User");
    }

    
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user_booking_expired.' . $this->booking->user_id),
        ];
    }

    public function broadcastAs()
    {
        return "UserBookingExpiredEvent";
    }

    public function broadcastWith()
    {
        return [
            'booking' => $this->booking->load(['bookable.room.building.seller']),
        ];
    }
}
