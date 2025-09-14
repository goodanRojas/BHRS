<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;
use Illuminate\Support\Facades\Auth;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => Auth::guard('web')->check()
                    ? Auth::guard('web')->user()->load([
                        'favorites',
                        'notifications' => fn($query) => $query->whereNull('read_at'),
                    ])
                    : null,
                'seller' => Auth::guard('seller')->user(),
                'admin' => Auth::guard('admin')->check()
                    ? Auth::guard('admin')->user()
                    : null,

            ],
            'flash' => [
                'success' => session('success'),
                'error' => session('error'),
                'message' => session('message'),
            ],
            'ziggy' => fn() => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
            'ssr' => true,
        ]);
    }
}
