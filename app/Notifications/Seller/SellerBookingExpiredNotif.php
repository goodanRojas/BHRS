<?php

namespace App\Notifications\Seller;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\{MailMessage, BroadcastMessage};
use Illuminate\Notifications\Notification;
use App\Models\Booking;
class SellerBookingExpiredNotif extends Notification
{
    use Queueable;

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
            'title' => 'Booking Expired',
            'message' => "{$this->booking->bookable->name} expired",
            'link' => route('seller.guest.history.show', $this->booking->id),
            'meta' => [
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
            'title' => 'Booking Expired',
            'message' => "{$this->booking->bookable->name} expired",
            'link' => route('seller.guest.history.show', $this->booking->id),
            'meta' => [
                'bed_name' => $this->booking->bookable->name,
                'room_name' => $this->booking->bookable->room->name,
                'building_name' => $this->booking->bookable->room->building->name,
                'start_date' => $this->booking->start_date,
                'month_count' => $this->booking->month_count,
            ]
        ]);
    }
}
