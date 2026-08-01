<?php

namespace App\Http\Controllers;

use App\Enums\OrderStatus;
use App\Enums\ProductStatus;
use App\Models\Address;
use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;


class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $orders = Order::query()
            ->where('user_id', $request->user()->id)
            ->with('items')
            ->latest()
            ->paginate(10);

        return Inertia::render('Orders/Index', [
            'orders' => $orders,
        ]);
    }
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'phone' => ['required', 'string', 'max:255'],
            'country_id' => ['required', 'integer', 'exists:countries,id'],
            'city' => ['required', 'string', 'max:255'],
            'address_line' => ['required', 'string'],
            'postal_code' => ['nullable', 'string', 'max:255'],
            'payment_method' => ['required', 'in:bank_transfer,cash_on_delivery'],
        ]);

        $user = $request->user();

        $cart = Cart::where('user_id', $user->id)->first();

        if (! $cart || $cart->items()->count() === 0) {
            return back()->with('error', 'Your cart is empty.');
        }

        $order = DB::transaction(function () use ($request, $user, $cart) {
            $address = Address::create([
                'user_id' => $user->id,
                'full_name' => $request->input('full_name'),
                'phone' => $request->input('phone'),
                'country_id' => $request->input('country_id'),
                'city' => $request->input('city'),
                'address_line' => $request->input('address_line'),
                'postal_code' => $request->input('postal_code'),
            ]);

            $cartItems = $cart->items()->with('product')->lockForUpdate()->get();

            foreach ($cartItems as $item) {
                if ($item->product->status !== ProductStatus::Available) {
                    throw new \RuntimeException("\"{$item->product->title['en']}\" is no longer available.");
                }

                if ($item->product->stock_quantity < $item->quantity) {
                    throw new \RuntimeException("\"{$item->product->title['en']}\" only has {$item->product->stock_quantity} unit(s) left.");
                }
            }

            $subtotal = $cartItems->sum(fn($item) => $item->product->effective_price * $item->quantity);

            $order = Order::create([
                'order_number' => 'ORD-' . now()->format('Y') . '-' . Str::upper(Str::random(8)),
                'user_id' => $user->id,
                'store_id' => $cartItems->first()->product->store_id,
                'shipping_address_id' => $address->id,
                'status' => OrderStatus::Pending,
                'subtotal' => $subtotal,
                'discount_amount' => 0,
                'tax_amount' => 0,
                'shipping_cost' => 0,
                'total' => $subtotal,
                'currency' => $cartItems->first()->product->currency,
                'payment_method' => $request->input('payment_method'),
            ]);

            foreach ($cartItems as $item) {
                $product = $item->product;

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'product_reference_snapshot' => $product->reference,
                    'product_title_snapshot' => $product->title,
                    'product_description_snapshot' => $product->description,
                    'product_image_snapshot' => $product->images->first()?->url,
                    'product_condition_snapshot' => $product->condition->value,
                    'unit_price' => $product->effective_price,
                    'quantity' => $item->quantity,
                ]);

                $remainingStock = $product->stock_quantity - $item->quantity;

                $product->update([
                    'stock_quantity' => $remainingStock,
                    'status' => $remainingStock === 0 ? ProductStatus::Reserved : $product->status,
                ]);
            }

            $cart->items()->delete();

            return $order;
        });

        return redirect()->route('orders.show', $order)->with('success', 'Order placed successfully!');
    }

    public function show(Request $request, Order $order): Response
    {
        abort_unless($order->user_id === $request->user()->id, 403);

        return Inertia::render('Orders/Show', [
            'order' => $order->load('items', 'shippingAddress.country'),
        ]);
    }
}
