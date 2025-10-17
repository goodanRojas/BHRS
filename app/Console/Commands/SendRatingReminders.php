<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Booking;
use App\Notifications\User\RatingReminderNotif;

class SendRatingReminders extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:send-rating-reminders';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Sends interval rating reminders to users who have not rated their ended bookings yet.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $threshold = now()->subHours(12);

        $bookings = Booking::where('status', 'ended')
            ->where('is_rated', false)
            ->where(function ($query) use ($threshold) {
                $query->whereNull('last_rating_reminder_at')
                    ->orWhere('last_rating_reminder_at', '<', $threshold);
            })
            ->get();

        foreach ($bookings as $booking) {
            $booking->update([
                'last_rating_reminder_at' => now(),
                'rating_reminder_count' => $booking->reminder_count + 1,
            ]);
            logger('booking rated');

            $booking->user->notify(new RatingReminderNotif($booking));
        }
    }
}
