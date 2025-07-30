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
        ]);
    }

    public function latest()
    {
        $latest = Auth::user()->unreadNotifications;
        return response()->json([
            'notifications' => $latest,
        ]);
    }
}
