<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\{Log};
use App\Models\Booking;

class CheckBookingEndDate extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'booking:check-end-date';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Check the if there are booking that end.';


    public function handle()
    {
        $bookings = Booking::whereDate('end_date', '=', now()->toDateString())->get();
        $bookingss = Booking::all();
        Log::info($bookingss->first());

        if ($bookings->isNotEmpty()) {
            foreach ($bookings as $booking) {
                $booking->status = 'finish';
                $booking->save();
                logger()->info('Booking has ended');
                //broadcast(new BookingStatueUpdated($booking));
            }
        } else {

            logger()->info('Event sent to React');
        }
    }
}
