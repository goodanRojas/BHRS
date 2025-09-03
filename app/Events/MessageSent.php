<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;
use App\Models\Message;
use App\Models\ChatGroup;

class MessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */

    public $message;
    public function __construct(Message $message)
    {
        $this->message = $message;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn()
    {
        return [
            new PrivateChannel("direct-messages.{$this->message->receiver_id}"),
            new PrivateChannel("direct-messages.{$this->message->sender_id}"),
        ];
    }



    public function broadcastWith()
    {
        return [
        'id' => $this->message->id,
        'sender_id' => $this->message->sender_id,
        'receiver_id' => $this->message->receiver_id,
        'content' => $this->message->content,
        'sent_at' => $this->message->sent_at,
        'created_at' => $this->message->created_at,
        'updated_at' => $this->message->updated_at,
        'sender' => $this->message->sender, // include full sender
        'receiver' => $this->message->receiver, // include full receiver
        ];
    }
}
