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

class NewBooking implements ShouldBroadcast
{

    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public $booking;

    public function __construct(Booking $booking)
    {
        $this->booking = $booking;
        Log::info("Booking created");
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('owner.' . $this->booking->bookable->room->building->seller_id),
        ];
    }
    public function broadcastAs()
    {
        return "NewBooking";
    }
    public function broadcastWith()
    {
        $seller = $this->booking->bookable->room->building->seller;

        return [
            "notification" => $seller->notifications()
                ->latest()      // query builder, not collection
                ->first(),      // or ->take(10)->get() if you want multiple
        ];
    }
}
