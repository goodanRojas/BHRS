<?php

namespace App\Events\Admin;

use App\Models\{Subscription, Admin};
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class AdminSubscriptionExpiredEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public $subscription;
    public $admin;
    public function __construct(Subscription $subscription)
    {
        $this->subscription = $subscription;
        $this->admin = Admin::first();
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('admin-subscription-expired.' . $this->admin->id),
        ];
    }

    public function broadcastAs()
    {
        return "AdminSubscriptionExpiredEvent";
    }
}
