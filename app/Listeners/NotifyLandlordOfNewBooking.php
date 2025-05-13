<?php

namespace App\Listeners;

use App\Events\NewBookingCreated;
use App\Notifications\NewBookingNotification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Queue\InteractsWithQueue;

class NotifyLandlordOfNewBooking
{
    /**
     * Create the event listener.
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     */
    public function handle(NewBookingCreated $event)
    {
        $booking = $event->booking;
        $landlord = $booking->bookable->room->building->seller;


        $landlord->notify(new NewBookingNotification($booking));
    }
}
