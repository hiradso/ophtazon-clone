<?php

namespace App\Console\Commands;

use App\Models\ExchangeRate;
use Illuminate\Console\Attributes\Description;
use Illuminate\Console\Attributes\Signature;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

/**
 * نرخ ارز زنده رو از دو منبع خارجی رایگان (بدون نیاز به کلید) می‌گیرد
 * و در دیتابیس خودمان کش می‌کند — فرانت‌اند هیچ‌وقت مستقیم به این
 * سرویس‌های خارجی وصل نمی‌شود، فقط از طریق prop اشتراکی خودمان.
 *
 * - USD/EUR از open.er-api.com (نرخ استاندارد جهانی)
 * - تومان از نرخ لحظه‌ای دلار/ریال بازار آزاد tgju.org (نه نرخ رسمی
 *   بانک مرکزی — همون نرخی که همه‌جا واقعاً استفاده می‌شه). این یک
 *   endpoint داخلی/غیررسمی سایت tgju است، نه یک API مستندشده — اگر
 *   فرمتش تغییر کرد یا از کار افتاد، این بخش فقط لاگ می‌کند و بدون
 *   کرش، به‌روزرسانی تومان را برای این دور رد می‌کند (رکورد قبلی در
 *   دیتابیس دست‌نخورده می‌ماند تا وقفه‌ی کوتاه باعث نمایش قیمت غلط
 *   نشود).
 */
#[Signature('app:sync-exchange-rates')]
#[Description('Fetch and cache live USD/EUR/IRT exchange rates')]
class SyncExchangeRates extends Command
{
    public function handle(): int
    {
        $ok = $this->syncStandardCurrencies();
        $this->syncToman();

        return $ok ? self::SUCCESS : self::FAILURE;
    }

    private function syncStandardCurrencies(): bool
    {
        try {
            $response = Http::timeout(10)->get('https://open.er-api.com/v6/latest/USD');
        } catch (\Throwable $e) {
            Log::warning('Exchange rate sync failed: could not reach provider.', ['error' => $e->getMessage()]);
            $this->error('Could not reach exchange rate provider: '.$e->getMessage());

            return false;
        }

        if (! $response->successful() || $response->json('result') !== 'success') {
            Log::warning('Exchange rate sync failed: bad response.', ['body' => $response->body()]);
            $this->error('Exchange rate provider returned an unexpected response.');

            return false;
        }

        $rates = $response->json('rates', []);

        ExchangeRate::updateOrCreate(
            ['currency' => 'USD'],
            ['rate_per_usd' => 1, 'fetched_at' => now()],
        );

        if (! isset($rates['EUR'])) {
            Log::warning('Exchange rate sync: provider response missing EUR.');

            return false;
        }

        ExchangeRate::updateOrCreate(
            ['currency' => 'EUR'],
            ['rate_per_usd' => $rates['EUR'], 'fetched_at' => now()],
        );

        $this->info("Synced EUR: 1 USD = {$rates['EUR']} EUR");

        return true;
    }

    private function syncToman(): void
    {
        try {
            $response = Http::timeout(10)->get('https://call1.tgju.org/ajax.json');
        } catch (\Throwable $e) {
            Log::warning('Toman rate sync failed: could not reach tgju.org.', ['error' => $e->getMessage()]);

            return;
        }

        $rial = $response->json('current.price_dollar_rl.p');

        if (! $response->successful() || ! $rial) {
            Log::warning('Toman rate sync failed: unexpected tgju.org response shape.');

            return;
        }

        $rial = (float) str_replace(',', '', $rial);

        if ($rial <= 0) {
            Log::warning('Toman rate sync failed: non-positive rial value.', ['raw' => $rial]);

            return;
        }

        $toman = $rial / 10;

        ExchangeRate::updateOrCreate(
            ['currency' => 'IRT'],
            ['rate_per_usd' => $toman, 'fetched_at' => now()],
        );

        $this->info("Synced IRT: 1 USD = {$toman} Toman (free-market rate)");
    }
}
