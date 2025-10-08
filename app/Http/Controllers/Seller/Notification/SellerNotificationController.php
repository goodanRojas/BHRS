<?php

namespace App\Http\Controllers\Seller\Notification;

use App\Http\Controllers\Controller;
use App\Notifications\NewBookingNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
class SellerNotificationController extends Controller
{
    public function latest()
    {
        $seller = auth('seller')->user();

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
        $owner = auth()->guard('seller')->user();
        return response()->json([
            'count' => $owner->unreadNotifications()->count(),
        ]);
    }

    public function index()
    {
        return Inertia::render('Seller/Notification/Index', [
            'notifications' => auth()->guard('seller')->user()->notifications()->latest()->get(),
            'highlight' => request('highlight'),
        ]);
    }
    public function markAllRead()
    {
        auth()->guard('seller')->user()->unreadNotifications->markAsRead();
        return back();
    }
    public function markAsRead($id)
    {
        $notification = auth()->guard('seller')->user()->notifications()->findOrFail($id);
        if ($notification->read_at === null) {
            $notification->markAsRead();
        }
        return back();
    }

    public function destroy($id)
    {
        $notification = auth()->guard('seller')->user()->notifications()->findOrFail($id);
        $notification->delete();
        return back();
    }
    public function destroyAll($type)
    {
        $query = auth()->guard('seller')->user()->notifications();

        if ($type === 'unread') {
            $query->whereNull('read_at')->delete();
        } elseif ($type === 'read') {
            $query->whereNotNull('read_at')->delete();
        }

        return back();
    }
}
