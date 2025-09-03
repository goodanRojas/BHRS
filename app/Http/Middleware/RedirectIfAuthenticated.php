<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Illuminate\Support\Facades\Auth;
class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, ...$guards)
    {
        $guards = empty($guards) ? ["web"] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                switch ($guard) {
                    case 'seller':
                        return redirect()->route('seller.dashboard.index'); // 👈 your seller homepage
                    case 'admin':
                        return redirect()->route('admin.dashboard');  // 👈 your admin homepage
                    default:
                        return redirect()->route('home');         // 👈 default user dashboard
                }
            }
        }
        return $next($request);
    }
}
