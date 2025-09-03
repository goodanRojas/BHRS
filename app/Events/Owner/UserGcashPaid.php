<?php

namespace App\Events\Owner;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Receipt;
use Illuminate\Support\Facades\Log;
class UserGcashPaid implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public $receipt;
    public function __construct(Receipt $receipt)
    {
        $this->receipt = $receipt->load([
            'booking.user',
            'booking.bookable.room.building.seller',
        ]);

    }

    public function broadcastAs()
    {
        return "UserGcashPaid";
    }

    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('owner_user_paid.' . $this->receipt->booking->bookable->room->building->seller_id),
        ];
    }

    public function broadcastWith()
    {
        return [
            'receipt' => $this->receipt,
        ];
    }
}
