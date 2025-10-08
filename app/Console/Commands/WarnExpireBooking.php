<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Carbon\Carbon;
use App\Models\Booking;
use App\Events\User\WarnBookingExpirationEvent;
use App\Notifications\User\WarningBookingExpirationNotif;
use Illuminate\Support\Facades\Log;
class WarnExpireBooking extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'app:warn-expire-booking';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Log::info('WarnExpireBooking Command started');
        $bookings = Booking::where('warned', null)->get();
        foreach ($bookings as $booking) {
            $start = Carbon::parse($booking->start_date);
            $end = $start->copy()->addMonths($booking->month_count);
            // Log::info('start date: ' . $start->toDateString() . ', end date: ' . $end->toDateString() . ', today: ' . now()->toDateString());
            // Log::info($end->diffInDays(now()) === 3 && now()->lessThanOrEqualTo($end));
            if (now()->lessThanOrEqualTo($end) && now()->diffInDays($end, false) <= 3) {
                Log::info('Booking expired: ' . $booking->id);
                $booking->update(['warned' => now()]);
                $booking->user->notify(new WarningBookingExpirationNotif($booking));
                event(new WarnBookingExpirationEvent($booking)); // Broadcast to User
            }
        }
    }
}
