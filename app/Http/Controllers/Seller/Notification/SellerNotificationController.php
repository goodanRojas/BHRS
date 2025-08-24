<?php

namespace App\Http\Controllers\Seller\Notification;

use App\Http\Controllers\Controller;
use App\Notifications\NewBookingNotification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

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
            $type = class_basename($notification->type);

            switch ($type) {
                case 'NewBookingNotification':
                    $message = "New booking for {$notification->data['bed_name']} in {$notification->data['room_name']} ({$notification->data['building_name']}) by {$notification->data['tenant_name']}";
                    $image   = $notification->data['tenant_image'] ?? $notification->data['bed_image'] ?? null;
                    break;

                default:
                    $message = $notification->data['message'] ?? 'You have a new notification.';
                    $image   = $notification->data['image'] ?? null;
                    break;
            }

            return [
                'id' => $notification->id,
                'type' => $type,
                'message' => $message,
                'image' => $image,
                'created_at' => $notification->created_at->diffForHumans(),
            ];
        });

        return response()->json([
            'notifications' => $notifications,
            'unread_count' => $seller->unreadNotifications()->count(),
        ]);
    }
}
