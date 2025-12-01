<?php

namespace App\Events\User;

use App\Models\CustomerSupport;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class CustomerSupportResponseEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */

    public $ticket;
    public function __construct(CustomerSupport $ticket)
    {
        $this->ticket = $ticket;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */

    public function broadcastAs(): string
    {
        return 'CustomerSupportResponseEvent';
    }
    public function broadcastOn(): array
    {
        $supportable = $this->ticket->supportable;

        return [
            new PrivateChannel('customer-support-response-channel.' . strtolower(class_basename($supportable)) . '.' . $supportable->id),
        ];
    }
}
