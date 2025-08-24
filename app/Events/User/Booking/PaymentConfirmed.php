<?php

namespace App\Events\User\Booking;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Booking;
class PaymentConfirmed implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public $booking;
    public function __construct(Booking $booking)
    {
        $this->booking = $booking;
    }

    public function broadcastAs()
    {
        return "UserPaymentConfirmed";
    }
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('user_payment_confirmed.' . $this->booking->user_id),
        ];
    }

    public function broadcastWith()
    {
        return [
            'booking' => $this->booking,
        ];
    }
}
