<?php

namespace App\Notifications\User;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\{MailMessage, BroadcastMessage};
use Illuminate\Notifications\Notification;
use Carbon\Carbon;
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
        return ['broadcast', 'database'];
    }

    /**
     * Get the array representation for database storage.
     */
    public function toDatabase($notifiable)
    {
        return [
            'title' => 'Booking Info',
            'message' => "{$this->booking->bookable->name} is about to expire!",
            'link' => route('accommodations.index', $this->booking->id),
            'meta' => [
                'id' => $this->booking->id,
                'start_date' => $this->booking->start_date,
                'end_date' => Carbon::parse($this->booking->start_date)->addMonths($this->booking->month_count),
            ]
        ];
    }
    public function toBroadcast($notifiable)
    {
        return new BroadcastMessage([
            'title' => 'Booking Info',
            'message' => "{$this->booking->bookable->name} is about to expire!",
            'link' => route('accommodations.index', $this->booking->id),
            'meta' => [
                'id' => $this->booking->id,
                'start_date' => $this->booking->start_date,
                'end_date' => Carbon::parse($this->booking->start_date)->addMonths($this->booking->month_count),
            ]
        ]);
    }
}
