<?php

namespace App\Notifications\User;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\BroadcastMessage;
use App\Models\Booking;
class UserBookingRejected extends Notification
{
    use Queueable;

    /**
     * Create a new notification instance.
     */
    public $booking;
    public $reason;
    public function __construct(Booking $booking, $reason)
    {
        $this->booking = $booking;
        $this->reason = $reason;
    }

    /**
     * Get the notification's delivery channels.
     *
     * @return array<int, string>
     */
    public function via(object $notifiable): array
    {
        // return ['mail', 'database', 'broadcast'];
        return ['database', 'broadcast'];
    }

    /**
     * Get the mail representation of the notification.
     */
  /*   public function toMail(object $notifiable): MailMessage
    {
        return (new MailMessage)
                    ->line('The introduction to the notification.')
                    ->action('Notification Action', url('/'))
                    ->line('Thank you for using our application!');
    }
 */
    /**
     * Get the array representation of the notification.
     *
     * @return array<string, mixed>
     */
   
    public function toDatabase($notifiable){
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
            'status' => $this->booking->status,
            'reason' => $this->reason,
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
            'status' => $this->booking->status,
            'reason' => $this->reason,
        ]);
    }
}
