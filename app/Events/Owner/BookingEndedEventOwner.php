<?php

namespace App\Events\Owner;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use App\Models\Booking;
class BookingEndedEventOwner implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

     public $booking;
    public function __construct(Booking $booking)
    {
        $this->booking = $booking;
        Log::info("Expired event from Owner");
    }

    
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('to_owner_user_booking_expired.' . $this->booking->bookable->room->building->seller_id),
        ];
    }

    public function broadcastAs()
    {
        return "ToOwnerUserBookingExpiredEvent";
    }

    public function broadcastWith()
    {
        return [
            'booking' => $this->booking->load(['bookable.room.building.seller']),
        ];
    }
}
