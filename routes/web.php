<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Support\Facades\Route;




Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';
require __DIR__.'/sellerBuilding.php';
require __DIR__.'/sellerGuest.php';
require __DIR__.'/homepage.php';
require __DIR__.'/favorite.php';
require __DIR__.'/booking.php';
require __DIR__.'/accommodation.php';
require __DIR__.'/user_notification.php';
require __DIR__.'/message.php';
require __DIR__.'/map.php';
require __DIR__.'/xendivel.php';
require __DIR__.'/seller/auth.php';
require __DIR__.'/admin/admin.php';