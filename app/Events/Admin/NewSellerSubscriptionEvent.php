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

class NewSellerSubscriptionEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public $subscription;
    public $admin;
    public function __construct(Subscription $subscription)
    {
        $this->subscription = $subscription->load(['plan','seller']);
        $this->admin = Admin::first(); // ✅ moved here
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('admin-new-seller-subscription.' . $this->admin->id),
        ];
    }

    public function broadcastAs()
    {
        return 'AdminNewSellerSubscriptionEvent';
    }
}
