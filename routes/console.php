<?php

use App\Console\Commands\CheckBookingEndDate;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Console\Scheduling\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote')->hourly();


Artisan::command('booking:check-end-date', function () {
    $this->comment("Check the if there are booking that end.");
})->everyFourHours();