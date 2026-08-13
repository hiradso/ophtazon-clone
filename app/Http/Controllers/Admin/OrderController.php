<?php

namespace App\Http\Controllers\Admin;

use App\Enums\OrderStatus;
use App\Enums\ProductStatus;
use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateOrderRequest;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Order::class);

        $orders = Order::query()
            ->with(['user:id,name,email', 'store:id,name'])
            ->when(Auth::user()->role === UserRole::Staff, function ($query) {
                $query->where('store_id', Auth::user()->store_id);
            })
            ->when($request->filled('status'), function ($query) use ($request) {
                $query->where('status', $request->input('status'));
            })
            ->when($request->filled('payment_method'), function ($query) use ($request) {
                $query->where('payment_method', $request->input('payment_method'));
            })
            ->when($request->filled('date_from'), function ($query) use ($request) {
                $query->whereDate('created_at', '>=', $request->input('date_from'));
            })
            ->when($request->filled('date_to'), function ($query) use ($request) {
                $query->whereDate('created_at', '<=', $request->input('date_to'));
            })
            ->when($request->filled('q'), function ($query) use ($request) {
                $search = $request->input('q');
                $query->where(function ($query) use ($search) {
                    $query->where('order_number', 'ilike', "%{$search}%")
                        ->orWhereHas('user', function ($query) use ($search) {
                            $query->where('name', 'ilike', "%{$search}%")
                                ->orWhere('email', 'ilike', "%{$search}%");
                        });
                });
            })
            ->latest()
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('Admin/Orders/Index', [
            'orders' => $orders,
            'filters' => $request->only(['status', 'payment_method', 'date_from', 'date_to', 'q']),
        ]);
    }

    public function show(Order $order): Response
    {
        $this->authorize('view', $order);

        return Inertia::render('Admin/Orders/Show', [
            'order' => $order->load([
                'user:id,name,email',
                'store:id,name',
                'items',
                'shippingAddress.country',
                'statusHistories.changedBy:id,name',
            ]),
            'customerOrderCount' => Order::where('user_id', $order->user_id)->count(),
        ]);
    }

    public function update(UpdateOrderRequest $request, Order $order): RedirectResponse
    {
        $newStatus = OrderStatus::from($request->input('status'));
        $statusChanged = $newStatus !== $order->status;

        DB::transaction(function () use ($request, $order, $newStatus, $statusChanged) {
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
                'admin_notes' => $request->input('admin_notes'),
                'tracking_number' => $request->input('tracking_number'),
            ]);

            if ($statusChanged) {
                $order->statusHistories()->create([
                    'status' => $newStatus,
                    'changed_by' => Auth::id(),
                ]);
            }
        });

        return back()->with('success', 'order_status_updated');
    }
}
