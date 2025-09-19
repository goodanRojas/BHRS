<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Carbon;
use App\Models\Booking;
use App\Notifications\User\BookingExpiredNotify;
use App\Events\User\Booking\BookingEndedEvent;
use App\Events\Owner\BookingEndedEventOwner;
use Illuminate\Support\Facades\Log;
class BookingExpiredCommand extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:booking-expired-command';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This checks for ended bookings.';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        Log::info('Checking for ended bookings.');

        $bookings = Booking::where('status', 'completed')->get();
        foreach ($bookings as $booking) {
            $start = Carbon::parse($booking->start_date);
            $end = $start->copy()->addMonths($booking->month_count);
            if ($end->isPast()) {
                Log::info('Booking expired: ' . $booking->id);
                $booking->update(['status' => 'ended']);
                $booking->bookable->room->building->seller->notify(new BookingExpiredNotify($booking)); // Notify Seller
                $booking->user->notify(new BookingExpiredNotify($booking));
                event(new BookingEndedEvent($booking)); // Broadcast to User
                event(new BookingEndedEventOwner($booking)); // Broadcast to Owner
                
            }
        }
    }
}
