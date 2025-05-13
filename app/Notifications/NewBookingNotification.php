<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class NewBookingNotification extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public function __construct(public $booking)
    {
        //
    }
    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return ['mail', 'database', 'broadcast'];
    }

    
    public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('New Booking Received')
            ->line('A new tenant has booked one of your beds.')
            ->action('View Booking', url('/seller/bookings'));
    }

    public function toDatabase($notifiable)
    {
        return [
            'booking_id' => $this->booking->id,
            'tenant_name' => $this->booking->user->name,
        ];
    }
    public function toBroadcast($notifiable)
    {
        return [
            'booking_id' => $this->booking->id,
            'tenant_name' => $this->booking->user->name,
        ];
    }
}
