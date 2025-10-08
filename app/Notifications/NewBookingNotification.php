<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;
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
        return [/* 'mail', */ 'database', 'broadcast'];
    }


    /* public function toMail($notifiable)
    {
        return (new MailMessage)
            ->subject('New Booking Received')
            ->line('A new tenant has booked one of your beds.')
            ->action('View Booking', url('/seller/bookings'));
    } */

    public function toDatabase($notifiable)
    {
         return [
            'title' => 'New Booking',
            'message' => "{$this->booking->user->name} booked {$this->booking->bookable->name}",
            'link' => route('seller.request.bed.show', $this->booking->id),
            'meta' => [
                'tenant_name' => $this->booking->user->name,
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
            'title' => 'New Booking',
            'message' => "{$this->booking->user->name} booked {$this->booking->bookable->name}",
            'link' => route('seller.request.bed.show', $this->booking->id),
            'meta' => [
                'tenant_name' => $this->booking->user->name,
                'bed_name' => $this->booking->bookable->name,
                'room_name' => $this->booking->bookable->room->name,
                'building_name' => $this->booking->bookable->room->building->name,
                'start_date' => $this->booking->start_date,
                'month_count' => $this->booking->month_count,
            ]
        ]);
    }
}
