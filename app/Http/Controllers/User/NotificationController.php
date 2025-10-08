<?php

namespace App\Http\Controllers\User;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class NotificationController extends Controller
{
    public function index()
    {
        return Inertia::render('Home/Notification/Index', [
            'notifications' => auth()->user()->notifications()->latest()->get(),
            'highlight' => request('highlight'),
        ]);
    }
    public function latest()
    {
        $seller = auth()->user();

        $unread = $seller->unreadNotifications()
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
            'unread_count' => $seller->unreadNotifications()->count(),
        ]);
    }

    public function count()
    {
        $user = auth()->user();
        return response()->json([
            'count' => $user->unreadNotifications->count(),
        ]);
    }
    public function markAllRead()
    {
        auth()->user()->unreadNotifications->markAsRead();
        return back();
    }
    public function markAsRead($id)
    {
        $notification = auth()->user()->notifications()->findOrFail($id);
        if ($notification->read_at === null) {
            $notification->markAsRead();
        }
        return back();
    }

    public function destroy($id)
    {
        $notification = auth()->user()->notifications()->findOrFail($id);
        $notification->delete();
        return back();
    }
    public function destroyAll($type)
    {
        $query = auth()->user()->notifications();

        if ($type === 'unread') {
            $query->whereNull('read_at')->delete();
        } elseif ($type === 'read') {
            $query->whereNotNull('read_at')->delete();
        }

        return back();
    }
}
