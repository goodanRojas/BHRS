<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome');
})->name('landingpage');




require __DIR__.'/user/auth.php';
require __DIR__.'/xendivel.php';
require __DIR__.'/seller/auth.php';
require __DIR__.'/admin/admin.php';
require __DIR__.'/chatbot/chatbot.php';