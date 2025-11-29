<?php

namespace App\Events\Admin;

use App\Models\CustomerSupport;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class NewCustomerSupportEvent implements ShouldBroadcast
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

    public function broadcastAs(): string
    {
        return 'NewCustomerSupportEvent';
    }
    
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('new-customer-support-channel'),
        ];
    }
}
