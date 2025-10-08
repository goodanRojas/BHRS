<?php

namespace App\Notifications\User;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use App\Models\Booking;
use Illuminate\Notifications\Messages\BroadcastMessage;
class BookingApprovedNotif extends Notification
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
        return ['database', 'broadcast'];
    }

    /* public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('New Booking Received')
            ->line('A new tenant has booked one of your beds.')
            ->action('View Booking', url('/seller/bookings'));
    }
 */
    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Booking Confirmed',
            'message' => "{$this->booking->bookable->name} has been confirmed",
            'link' => route('accommodations.index'),
            'meta' => [
                'owner_name' => $this->booking->bookable->room->building->seller->name,
                'bed_name' => $this->booking->bookable->name,
                'room_name' => $this->booking->bookable->room->name,
                'building_name' => $this->booking->bookable->room->building->name,
                'start_date' => $this->booking->start_date,
                'month_count' => $this->booking->month_count,
            ]
        ];
    }
    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'title' => 'Booking Confirmed',
            'message' => "{$this->booking->bookable->name} has been confirmed",
            'link' => route('accommodations.index'),
            'meta' => [
                'owner_name' => $this->booking->bookable->room->building->seller->name,
                'bed_name' => $this->booking->bookable->name,
                'room_name' => $this->booking->bookable->room->name,
                'building_name' => $this->booking->bookable->room->building->name,
                'start_date' => $this->booking->start_date,
                'month_count' => $this->booking->month_count,
            ]
        ]);
    }
}
