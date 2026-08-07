<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;
use Illuminate\Support\Facades\URL;

/**
 * زبان را از پیشوند URL (مثلاً /en/products یا /fa/cart) می‌خواند —
 * فقط برای مسیرهای سایت عمومی استفاده می‌شود. پنل مدیریت همچنان
 * از App\Http\Middleware\SetLocale (مبتنی بر session) استفاده می‌کند.
 *
 * نکته‌ی کلیدی: URL::defaults(['locale' => ...]) باعث می‌شود هر
 * فراخوانی route() — چه در PHP، چه در جاوااسکریپت از طریق Ziggy —
 * خودکار همین locale فعلی را به‌عنوان پارامتر بگیرد، بدون نیاز به
 * اصلاح دستی هزاران فراخوانی route() در کل پروژه.
 */
class SetLocaleFromUrl
{
    public function handle(Request $request, Closure $next)
    {
        $locale = $request->route('locale');

        if (in_array($locale, ['en', 'fr', 'fa'], true)) {
            App::setLocale($locale);
            $request->session()->put('locale', $locale);
            URL::defaults(['locale' => $locale]);
        }

        return $next($request);
    }
}
