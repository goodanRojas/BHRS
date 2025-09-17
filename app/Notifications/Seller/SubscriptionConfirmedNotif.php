<?php

namespace App\Notifications\Seller;

use App\Models\Subscription;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\{MailMessage, BroadcastMessage};
use Illuminate\Notifications\Notification;

class SubscriptionConfirmedNotif extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public $subscription;
    public function __construct(Subscription $subscription)
    {
        $this->subscription = $subscription;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['database','broadcast'];
    }
    public function toArray(object $notifiable): array
    {
        return [
            'application_id' => $this->subscription->id,
            'status' => 'confirmed',
            'message' => 'Your Subscription has been confirmed!',
        ];
    }

    public function toBroadcast(object $notifiable)
    {
        return new BroadcastMessage(  [
            'application_id' => $this->subscription->id,
            'status' => 'confirmed',
            'message' => 'Your Subscription has been confirmed!',
        ]);
    }
}
