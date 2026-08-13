<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

/**
 * شبیه‌سازی یک درگاه پرداخت آنلاین ایرانی (مثل زرین‌پال/آیدی‌پی) —
 * هیچ اتصال واقعی به بانک یا تراکنش مالی واقعی وجود ندارد. فقط برای
 * نمایش کامل جریان «ثبت سفارش تا پرداخت موفق» طراحی شده.
 */
class GatewayController extends Controller
{
    public function show(Request $request, string $locale, Order $order): Response
    {
        $this->authorizeAccess($request, $order);

        return Inertia::render('Checkout/Gateway', [
            'order' => $order,
        ]);
    }

    public function process(Request $request, string $locale, Order $order): RedirectResponse
    {
        $this->authorizeAccess($request, $order);

        $request->validate([
            'action' => ['required', 'in:approve,reject'],
        ]);

        if ($request->input('action') === 'approve') {
            $order->update([
                'status' => OrderStatus::Paid,
                'paid_at' => now(),
            ]);

            return redirect()
                ->route('orders.show', ['locale' => app()->getLocale(), 'order' => $order])
                ->with('success', 'payment_success');
        }

        return redirect()
            ->route('orders.show', ['locale' => app()->getLocale(), 'order' => $order])
            ->with('error', 'payment_failed');
    }

    private function authorizeAccess(Request $request, Order $order): void
    {
        abort_unless($order->user_id === $request->user()->id, 403);
        abort_unless($order->payment_method === 'online_gateway', 404);
        abort_unless($order->status === OrderStatus::Pending, 404);
    }
}
