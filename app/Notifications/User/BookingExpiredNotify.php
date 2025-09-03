<?php

namespace App\Notifications\User;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;
use App\Models\Booking;

class BookingExpiredNotify extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public $booking;
    public function __construct(Booking $booking )
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
        return [ 'database', 'broadcast'];
        // return ['mail', 'database', 'broadcast'];
    }

/*     public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('Booking expired')
            ->line('Your booking has expired.')
            ->action('View Booking', url('/seller/bookings'));
    } */

    public function toDatabase($notifiable)
    {
        return [
            'booking_id' => $this->booking->id,
            'tenant_name' => $this->booking->user->name,
            'tenant_image' => $this->booking->user->avatar,
            'bed_image' => $this->booking->bookable->image,
            'bed_name' => $this->booking->bookable->name,
            'room_name' => $this->booking->bookable->room->name,
            'building_name' => $this->booking->bookable->room->building->name,
            'start_date' => $this->booking->start_date,
            'month_count' => $this->booking->month_count,
        ];
    }
    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'booking_id' => $this->booking->id,
            'tenant_name' => $this->booking->user->name,
            'tenant_image' => $this->booking->user->avatar,
            'bed_image' => $this->booking->bookable->image,
            'bed_name' => $this->booking->bookable->name,
            'room_name' => $this->booking->bookable->room->name,
            'building_name' => $this->booking->bookable->room->building->name,
            'start_date' => $this->booking->start_date,
            'month_count' => $this->booking->month_count,
        ]);
    }
}
