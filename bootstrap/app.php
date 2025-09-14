<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use App\Http\Middleware\{SellerMiddleware, AdminMiddleware, RedirectIfAuthenticated};
use App\Http\Middleware\Seller\{CheckSubscriptionFeature, CheckPendingSubscription};
use Inertia\Inertia;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        channels: __DIR__ . '/../routes/channels.php',
        // api: __DIR__.'/../routes/api.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            // \App\Http\Middleware\EnsureOnBoardingIsComplete::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);

        $middleware->alias([
            'seller' => SellerMiddleware::class,
            'admin' => AdminMiddleware::class,
            'guest' => RedirectIfAuthenticated::class,
            'check.subscription' => CheckSubscriptionFeature::class,
            'check.pending.subscription' => CheckPendingSubscription::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions) {
        $exceptions->renderable(function (NotFoundHttpException $e, $request) {
            if ($request->expectsJson()) {
                return response()->json(['message' => 'Resource not found'], 404);
            }

            return Inertia::render("Errors/NotFound")->toResponse($request)->setStatusCode(404);
        });
    })->create();
