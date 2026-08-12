<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Enums\ProductStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateOrderRequest;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', Order::class);

        $orders = Order::query()
            ->with(['user:id,name,email', 'store:id,name'])
            ->when(Auth::user()->role === UserRole::Staff, function ($query) {
                $query->where('store_id', Auth::user()->store_id);
            })
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
        ]);
    }

    public function show(Order $order): Response
    {
        $this->authorize('view', $order);

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order->load(['user:id,name,email', 'store:id,name', 'items', 'shippingAddress.country']),
        ]);
    }

    public function update(UpdateOrderRequest $request, Order $order): RedirectResponse
    {
        $newStatus = OrderStatus::from($request->input('status'));

        DB::transaction(function () use ($order, $newStatus) {
            $order->load('items');

            if ($newStatus === OrderStatus::Delivered) {
                foreach ($order->items as $item) {
                    if ($item->product && $item->product->status === ProductStatus::Reserved) {
                        $item->product->update(['status' => ProductStatus::Sold]);
                    }
                }
            }

            if ($newStatus === OrderStatus::Cancelled) {
                foreach ($order->items as $item) {
                    if ($item->product && $item->product->status === ProductStatus::Reserved) {
                        $item->product->update(['status' => ProductStatus::Available]);
                    }
                }
            }

            $order->update([
                'status' => $newStatus,
                'paid_at' => $newStatus === OrderStatus::Paid && ! $order->paid_at ? now() : $order->paid_at,
            ]);
        });

        return back()->with('success', 'order_status_updated');
    }
}
