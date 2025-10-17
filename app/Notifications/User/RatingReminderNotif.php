<?php

namespace App\Notifications\User;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\{MailMessage, BroadcastMessage};
use Illuminate\Notifications\Notification;
use App\Models\Booking;
class RatingReminderNotif extends Notification
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
    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Rating Reminder',
            'message' => "{$this->booking->bookable->name} needs your rating",
            'link' => route('feedback.bookings.show', $this->booking->id),
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
             'title' => 'Rating Reminder',
            'message' => "{$this->booking->bookable->name} needs your rating",
            'link' => route('feedback.bookings.show', $this->booking->id),
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
