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
        $admin = auth('admin')->user();

        $unread = $admin->unreadNotifications()
            ->latest()
            ->take(10)
            ->get();



        $notifications = $unread->map(function ($notification) {
            return [
                'id' => $notification->id,
                'title' => $notification->data['title'] ?? class_basename($notification->type),
                'message' => $notification->data['message'] ?? 'You have a new notification.',
                'image' => $notification->data['image'] ?? null,
                'link' => $notification->data['link'] ?? null,
                'meta' => $notification->data['meta'] ?? [],
                'created_at' => $notification->created_at->diffForHumans(),
            ];
        });

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $admin->unreadNotifications()->count(),
        ]);
    }

    public function count()
    {
        $admin = auth('admin')->user();
        return response()->json([
            'count' => $admin->unreadNotifications->count(),
        ]);
    }

}
