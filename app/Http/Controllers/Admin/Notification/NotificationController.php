<?php

namespace App\Http\Controllers\Admin\Notification;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index(Request $request, $id = null)
    {
        $admin = auth()->guard('admin')->user();
        if ($id) {
            $notification = $admin->notifications()->where('id', $id)->first();
            if ($notification) {
                $notification->markAsRead();
            }
        }
        $notifications = $admin->notifications()->orderBy('created_at', 'desc')->get();
        return inertia('Admin/Notification/Index', [
            'notifications' => $notifications,
            'hightlight' => $id
        ]);
    }


    public function latest()
    {
        $latest = Auth::guard('admin')->user()->unreadNotifications;
        logger($latest->toArray());
        return response()->json([
            'notifications' => $latest ? $latest->toArray() : [],
        ]);
    }

}
