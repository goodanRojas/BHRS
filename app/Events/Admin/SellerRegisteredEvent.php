<?php

namespace App\Events\Admin;

use App\Models\{SellerApplication, Admin};
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class SellerRegisteredEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public $application;
    public $admin;
    public function __construct(SellerApplication $application)
    {
        $this->application = $application;
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
            new PrivateChannel('admin-new-seller-application.'. $this->admin->id),
        ];
    }
    public function broadcastAs(): string{
        return 'SellerApplicationCreated';
    }


}
