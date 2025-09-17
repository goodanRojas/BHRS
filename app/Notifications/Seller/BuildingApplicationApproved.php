<?php

namespace App\Notifications\Seller;

use App\Models\BuildingApplication;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\{MailMessage, BroadcastMessage};
use Illuminate\Notifications\Notification;

class BuildingApplicationApproved extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public $application;
    public function __construct(BuildingApplication $application)
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
        return ['database', 'broadcast'];
    }

    /**
     * Get the mail representation of the notification.
     */


    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
    public function toArray(object $notifiable): array
    {
        return [
            'application_id' => $this->application->id,
            'status' => 'approved',
            'message' => 'Your building application has been approved!',
        ];
    }

    public function toBroadcast(object $notifiable)
    {
        return new BroadcastMessage([
            'application_id' => $this->application->id,
            'status' => 'approved',
            'message' => 'Your building application has been approved!',
        ]);
    }

}
