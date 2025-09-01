<?php

namespace App\Events;

use App\Models\ChatGroupMessage;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class GroupMessageSent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    /**
     * Create a new event instance.
     */
    public $message;
    public $tempId;
    public function __construct(ChatGroupMessage $message, $tempId)
    {
        $this->tempId = $tempId;
        $this->message = $message;
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn()
    {
        return [new PrivateChannel("group-messages.{$this->message->group_id}")];
    }

    public function broadcastWith()
    {
        return [
            'id' => $this->message->id,
            'group_id' => $this->message->group_id,
            'sender_id' => $this->message->sender_id,
            'content' => $this->message->content,
            'sent_at' => $this->message->sent_at,
            'sender' => $this->message->sender->only(['id', 'name', 'email']) ,
            'tempId' => $this->tempId,
        ];
    }
    public function broadcastAs()
    {
        return 'GroupMessageSent';
    }
}
