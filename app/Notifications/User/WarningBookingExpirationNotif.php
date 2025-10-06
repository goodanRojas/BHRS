<?php

namespace App\Notifications\User;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\{MailMessage, BroadcastMessage};
use Illuminate\Notifications\Notification;
use App\Models\Booking;
use Illuminate\Support\Facades\Log;

class WarningBookingExpirationNotif extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public $booking;
    public function __construct(Booking $booking)
    {
        $this->booking = $booking;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        return [/* 'mail' */ 'database', 'broadcast'];
    }

    /**
     * Get the mail representation of the notification.
     */
    /*     public function toMail(object $notifiable): MailMessage
        {
            return (new MailMessage)
                ->line('The introduction to the notification.')
                ->action('Notification Action', url('/'))
                ->line('Thank you for using our application!');
        } */
    public function toDatabase($notifiable)
    {
        Log::info("Running toDatabase for booking {$this->booking->id}");

        return [
            'booking_id' => $this->booking->id,
            'tenant_name' => $this->booking->user->name,
            'tenant_image' => $this->booking->user->avatar,
            'bed_image' => $this->booking->bookable?->image,
            'bed_name' => $this->booking->bookable?->name,
            'room_name' => $this->booking->bookable?->room->name,
            'building_name' => $this->booking->bookable?->room->building->name,
            'start_date' => $this->booking->start_date,
            'month_count' => $this->booking->month_count,
        ];
    }
    public function toBroadcast($notifiable)
    {
        Log::info("Running toDatabase for booking {$this->booking->id}");

        return new BroadcastMessage([
            'booking_id' => $this->booking->id,
            'tenant_name' => $this->booking->user->name,
            'tenant_image' => $this->booking->user->avatar,
            'bed_image' => $this->booking->bookable?->image,
            'bed_name' => $this->booking->bookable?->name,
            'room_name' => $this->booking->bookable?->room->name,
            'building_name' => $this->booking->bookable?->room->building->name,
            'start_date' => $this->booking->start_date,
            'month_count' => $this->booking->month_count,
        ]);
    }
}
