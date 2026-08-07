<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class DashboardController extends Controller
{
    public function index(): Response
    {
        $today = now();
        $currentStart = $today->copy()->subDays(29)->startOfDay();
        $previousStart = $today->copy()->subDays(59)->startOfDay();
        $previousEnd = $today->copy()->subDays(30)->endOfDay();

        // روند فروش ۳۰ روز اخیر — هر روز حتی اگر فروشی نداشته، با صفر پر می‌شود
        $rawDaily = Order::where('status', '!=', 'cancelled')
            ->where('created_at', '>=', $currentStart)
            ->selectRaw('DATE(created_at) as date, SUM(total) as revenue, COUNT(*) as orders_count')
            ->groupBy('date')
            ->get()
            ->keyBy(fn($row) => (string) $row->date);

        $salesChart = collect(range(29, 0))->map(function ($daysAgo) use ($today, $rawDaily) {
            $date = $today->copy()->subDays($daysAgo)->format('Y-m-d');
            $row = $rawDaily->get($date);

            return [
                'date' => $date,
                'revenue' => $row ? (float) $row->revenue : 0,
                'orders' => $row ? (int) $row->orders_count : 0,
            ];
        })->values();

        // پرفروش‌ترین محصولات بر اساس درآمد — از روی order_items، DB-agnostic (بدون توابع JSON خام)
        $topProducts = OrderItem::select('product_reference_snapshot', 'product_title_snapshot', 'unit_price', 'quantity')
            ->get()
            ->groupBy('product_reference_snapshot')
            ->map(function ($items) {
                $first = $items->first();

                return [
                    'reference' => $first->product_reference_snapshot,
                    'title' => $first->product_title_snapshot['en'] ?? $first->product_reference_snapshot,
                    'revenue' => (float) $items->sum(fn($i) => $i->unit_price * $i->quantity),
                    'units_sold' => (int) $items->sum('quantity'),
                ];
            })
            ->sortByDesc('revenue')
            ->take(5)
            ->values();

        // فروش بر اساس فروشگاه
        $salesByStore = Order::where('status', '!=', 'cancelled')
            ->join('stores', 'orders.store_id', '=', 'stores.id')
            ->selectRaw('stores.name as store_name, SUM(orders.total) as revenue, COUNT(orders.id) as orders_count')
            ->groupBy('stores.id', 'stores.name')
            ->orderByDesc('revenue')
            ->get()
            ->map(fn($row) => [
                'store' => $row->store_name,
                'revenue' => (float) $row->revenue,
                'orders' => (int) $row->orders_count,
            ]);

        $validOrders = Order::where('status', '!=', 'cancelled');
        $totalRevenue = (float) (clone $validOrders)->sum('total');
        $totalOrders = (clone $validOrders)->count();

        // مقایسه با ۳۰ روز قبلِ همین بازه (روز ۳۰ تا ۵۹ پیش)
        $currentPeriodRevenue = (float) (clone $validOrders)->where('created_at', '>=', $currentStart)->sum('total');
        $currentPeriodOrders = (clone $validOrders)->where('created_at', '>=', $currentStart)->count();

        $previousPeriodRevenue = (float) (clone $validOrders)
            ->whereBetween('created_at', [$previousStart, $previousEnd])
            ->sum('total');
        $previousPeriodOrders = (clone $validOrders)
            ->whereBetween('created_at', [$previousStart, $previousEnd])
            ->count();

        $revenueChangePercent = $previousPeriodRevenue > 0
            ? round((($currentPeriodRevenue - $previousPeriodRevenue) / $previousPeriodRevenue) * 100, 1)
            : null;

        $ordersChangePercent = $previousPeriodOrders > 0
            ? round((($currentPeriodOrders - $previousPeriodOrders) / $previousPeriodOrders) * 100, 1)
            : null;

        return Inertia::render('Dashboard', [
            'stats' => [
                'totalRevenue' => $totalRevenue,
                'totalOrders' => $totalOrders,
                'totalProducts' => Product::count(),
                'totalCustomers' => User::where('role', 'customer')->count(),
                'averageOrderValue' => $totalOrders > 0 ? round($totalRevenue / $totalOrders, 2) : 0,
                'revenueChangePercent' => $revenueChangePercent,
                'ordersChangePercent' => $ordersChangePercent,
            ],
            'salesChart' => $salesChart,
            'topProducts' => $topProducts,
            'salesByStore' => $salesByStore,
            'currency' => Order::value('currency') ?? 'EUR',
        ]);
    }
}
