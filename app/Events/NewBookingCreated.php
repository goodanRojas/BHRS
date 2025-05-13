<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
class NewBookingCreated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $booking;
    public $monthCount;
    public function __construct($booking, $monthCount)
    {
        $this->booking = $booking;
        $this->monthCount = $monthCount;
        Log::info('New booking created event fired', $booking->toArray());
        
    }
    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
       public function broadcastOn()
    {
        // Customize based on landlord ID
        return new PrivateChannel('landlord.' . $this->booking->bookable->room->building->seller_id);
    }

  public function broadcastWith()
{
    return [
        'booking_id' => $this->booking->id,
        'tenant_name' => $this->booking->user->name,
        'tenant_email' => $this->booking->user->email,
        'tenant_avatar' => $this->booking->user->avatar, // Ensure avatar URL is correct or prepend storage path
        'room_name' => $this->booking->bookable->name, // Assuming bookable is the bed/room object
        'room_image' => '/storage/bed/' . $this->booking->bookable->image, // Room image
        'start_date' => $this->booking->start_date, // Convert start_date to a proper format
        'month_count' => $this->monthCount, // Month count
        'payment_method' => $this->booking->payment_method, // Payment method

    ];
}

     public function broadcastAs()
    {
        return 'NewBookingCreated';
    }
}
