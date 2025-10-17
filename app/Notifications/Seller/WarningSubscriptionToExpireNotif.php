<?php

namespace App\Notifications\Seller;

use App\Models\Subscription;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\{MailMessage, BroadcastMessage};
use Illuminate\Notifications\Notification;

class WarningSubscriptionToExpireNotif extends Notification
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
        return ['broadcast', 'database'];
    }

    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Subscription',
            'message' => "Your subscription plan is about to expire.",
            'link' => route('seller.dashboard.index'),
            'meta' => [
                'subscription_type' => $this->subscription->plan->name,
                'status' => $this->subscription->status,
            ]
        ];
    }
    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
       'title' => 'Subscription',
            'message' => "Your subscription plan is about to expire.",
            'link' => route('seller.dashboard.index'),
            'meta' => [
                'subscription_type' => $this->subscription->plan->name,
                'status' => $this->subscription->status,
            ]
        ]);
    }
}
