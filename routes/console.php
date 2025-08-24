<?php

use App\Console\Commands\BookingExpiredCommand;
use App\Console\Commands\CheckBookingEndDate;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\{Artisan, Schedule};

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();


Schedule::command(BookingExpiredCommand::class)->everyMinute();