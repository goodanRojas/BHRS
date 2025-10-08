<?php

namespace App\Notifications\Admin;

use App\Models\Subscription;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\{MailMessage, BroadcastMessage};
use Illuminate\Notifications\Notification;


class NewSellerSubscriptionNotif extends Notification
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


    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Owner Subscription',
            'message' => "{$this->subscription->seller->name} subcribed for {$this->subscription->plan->name}.",
            'link' => route('admin.subscriptions.show', $this->subscription->id),
            'meta' => [
                'owner_name' => $this->subscription->seller->name,
                'email' => $this->subscription->seller->email,
                'phone' => $this->subscription->seller->phone,
            ]
        ];
    }
    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'title' => 'Owner Subscription',
            'message' => "{$this->subscription->seller->name} subcribed for {$this->subscription->plan->name}.",
            'link' => route('admin.subscriptions.show', $this->subscription->id),
            'meta' => [
                'owner_name' => $this->subscription->seller->name,
                'email' => $this->subscription->seller->email,
                'phone' => $this->subscription->seller->phone,
            ]
        ]);
    }
}
