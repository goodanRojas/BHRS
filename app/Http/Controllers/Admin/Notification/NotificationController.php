<?php

namespace App\Http\Controllers\Admin\Notification;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
class NotificationController extends Controller
{

    public function index()
    {
        return Inertia::render('Admin/Notification/Index', [
            'notifications' => auth()->guard('admin')->user()->notifications()->latest()->get(),
            'highlight' => request('highlight'),
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
    public function markAllRead()
    {
        auth()->guard('admin')->user()->unreadNotifications->markAsRead();
        return back();
    }
    public function markAsRead($id)
    {
        $notification = auth()->guard('admin')->user()->notifications()->findOrFail($id);
        if ($notification->read_at === null) {
            $notification->markAsRead();
        }
        return back();
    }

    public function destroy($id)
    {
        $notification = auth()->guard('admin')->user()->notifications()->findOrFail($id);
        $notification->delete();
        return back();
    }
    public function destroyAll($type)
    {
        $query = auth()->guard('admin')->user()->notifications();

        if ($type === 'unread') {
            $query->whereNull('read_at')->delete();
        } elseif ($type === 'read') {
            $query->whereNotNull('read_at')->delete();
        }

        return back();
    }
}
