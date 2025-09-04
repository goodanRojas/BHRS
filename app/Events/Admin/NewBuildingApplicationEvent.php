<?php

namespace App\Events\Admin;

use App\Models\BuildingApplication;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class NewBuildingApplicationEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public $application;
    public $adminId;
    public function __construct($adminId, BuildingApplication $application)
    {
        $this->adminId = $adminId;
        $this->application = $application;
        Log::info("New Building Application event is fired");
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel('admin-new-building-app.' . $this->adminId),
        ];
    }

    public function broadcastAs()
    {
        return 'ToAdminNewBuildingAppEvent';
    }

    public function broadcastWith()
    {
        return [
            'application' => $this->application->load(['seller'])
        ];
    }
}
