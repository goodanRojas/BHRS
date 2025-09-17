<?php

namespace App\Notifications\Admin;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\{MailMessage, BroadcastMessage};
use Illuminate\Notifications\Notification;
use App\Models\Subscription;
class SellerSubscriptionUpgradeNotif extends Notification
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
        return ['database', 'broadcast'];
    }


    public function toArray(object $notifiable): array
    {
        return [
            'subscription_id' => $this->subscription->id,
            'status' => 'pending',
            'message' => 'New Pending Upgrade Subscription',
        ];
    }

    public function toBroadcast(object $notifiable)
    {
        return new BroadcastMessage([
            'subscription_id' => $this->subscription->id,
            'status' => 'pending',
            'message' => 'New Pending Upgrade Subscription',
        ]);
    }
}
