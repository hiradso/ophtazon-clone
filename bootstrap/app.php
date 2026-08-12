<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;
use Symfony\Component\HttpFoundation\Response;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__ . '/../routes/web.php',
        commands: __DIR__ . '/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware): void {
        $middleware->web(append: [
            \App\Http\Middleware\HandleInertiaRequests::class,
            \Illuminate\Http\Middleware\AddLinkHeadersForPreloadedAssets::class,
        ]);
        $middleware->alias([
            'role' => \App\Http\Middleware\EnsureUserHasRole::class,
            'setlocale.url' => \App\Http\Middleware\SetLocaleFromUrl::class,
        ]);
        $middleware->web(append: [
            \App\Http\Middleware\SetLocale::class,
        ]);
    })
    ->withExceptions(function (Exceptions $exceptions): void {
        $exceptions->shouldRenderJsonWhen(
            fn(Request $request) => $request->is('api/*'),
        );

        $exceptions->respond(function (Response $response, \Throwable $exception, Request $request) {
            // اگر درخواست از نوع Inertia/HTML بود (نه API)، و کد وضعیت
            // یکی از خطاهای معمول بود، صفحه‌ی اختصاصی خودمان را نشان بده
            if (! $request->is('api/*') && in_array($response->getStatusCode(), [403, 404, 419, 429, 500, 503], true)) {
                // برای مسیرهایی که اصلاً با هیچ روتی مچ نشدن (۴۰۴ واقعی)،
                // میدل‌ور SetLocaleFromUrl هرگز اجرا نمی‌شود — یعنی نه
                // URL::defaults(['locale' => ...]) تنظیم شده (پس Ziggy در
                // جاوااسکریپت با خطای «locale پارامتر لازم است» متوقف
                // می‌شود) و نه prop اشتراکی locale پر شده. اینجا دستی
                // همان کاری را می‌کنیم که آن میدل‌ور می‌کرد.
                $locale = in_array($request->segment(1), ['en', 'fr', 'fa'], true)
                    ? $request->segment(1)
                    : config('app.locale', 'en');

                App::setLocale($locale);
                URL::defaults(['locale' => $locale]);

                return Inertia::render('Error', [
                    'status' => $response->getStatusCode(),
                    'locale' => $locale,
                ])
                    ->toResponse($request)
                    ->setStatusCode($response->getStatusCode());
            }

            return $response;
        });
    })->create();
