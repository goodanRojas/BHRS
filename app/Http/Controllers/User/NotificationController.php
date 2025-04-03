<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function markAsRead(Request $request, $bedId, $notificationId)
    {
        $notification = $request->user()->notifications()->where('id', $notificationId)->first();
        if ($notification) {
            $notification->markAsRead();
        }
        return redirect()->route('accommodations.index', ['bedId' => $bedId]);
    }
}
