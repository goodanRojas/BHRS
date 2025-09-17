<?php

namespace App\Notifications\User;

use App\Models\SellerApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\BroadcastMessage;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Support\Facades\Broadcast;

class SellerApplicationApproved extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public $application;
    public function __construct(SellerApplication $application)
    {
        $this->application = $application;
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

    /**
     * Get the array representation for database storage.
     */
    public function toArray(object $notifiable): array
    {
        return [
            'application_id' => $this->application->id,
            'status' => 'approved',
            'message' => 'Your seller application has been approved!',
        ];
    }

    public function toBroadcast(object $notifiable)
    {
        return new BroadcastMessage([
            'application_id' => $this->application->id,
            'status' => 'approved',
            'message' => 'Your seller application has been approved!',
        ]);
    }
}
