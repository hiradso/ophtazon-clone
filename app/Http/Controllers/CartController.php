<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CartController extends Controller
{
    public function index(): Response
    {
        $cart = $this->currentCart(request());

        return Inertia::render('Cart/Index', [
            'cart' => $cart
                ? $cart->load(['items.product.images', 'items.product.store'])
                : null,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'product_id' => ['required', 'integer', 'exists:products,id'],
        ]);

        $product = Product::findOrFail($request->input('product_id'));

        if ($product->status->value !== 'available') {
            return back()->with('error', 'This product is no longer available.');
        }

        $cart = $this->currentCart($request, createIfMissing: true);

        $existing = $cart->items()->where('product_id', $product->id)->first();

        if ($existing) {
            return back()->with('success', 'Item is already in your cart.');
        }

        $cart->items()->create([
            'product_id' => $product->id,
            'quantity' => 1,
        ]);

        return back()->with('success', 'Added to cart.');
    }
    public function preview(Request $request): \Illuminate\Http\JsonResponse
    {
        $cart = $request->user()
            ? Cart::where('user_id', $request->user()->id)->first()
            : Cart::where('session_id', $request->session()->getId())->first();

        if (! $cart) {
            return response()->json(['items' => [], 'total' => 0, 'currency' => null]);
        }

        $items = $cart->items()->with('product.images', 'product.store')->get();
        $total = $items->sum(fn($item) => $item->product->effective_price * $item->quantity);

        return response()->json([
            'items' => $items->map(fn($item) => [
                'id' => $item->id,
                'quantity' => $item->quantity,
                'product' => [
                    'title' => $item->product->getTranslations('title'),
                    'price' => $item->product->effective_price,
                    'original_price' => $item->product->price,
                    'discount_percentage' => $item->product->discount_percentage,
                    'currency' => $item->product->currency,
                    'slug' => $item->product->slug,
                    'image' => $item->product->images->first()?->url,
                    'stock_quantity' => $item->product->stock_quantity,
                ],
            ]),
            'total' => $total,
            'currency' => $items->first()?->product->currency,
        ]);
    }
    public function update(Request $request, CartItem $cartItem): RedirectResponse
    {
        $cart = $this->currentCart($request);
        abort_unless($cart && $cartItem->cart_id === $cart->id, 403);

        $request->validate([
            'quantity' => ['required', 'integer', 'min:1'],
        ]);

        $product = $cartItem->product;
        $requestedQuantity = (int) $request->input('quantity');

        if ($requestedQuantity > $product->stock_quantity) {
            return back()->with(
                'error',
                "Only {$product->stock_quantity} unit(s) of \"{$product->title['en']}\" are available."
            );
        }

        $cartItem->update(['quantity' => $requestedQuantity]);

        return back()->with('success', 'Quantity updated.');
    }

    public function destroy(CartItem $cartItem): RedirectResponse
    {
        $cart = $this->currentCart(request());

        abort_unless($cart && $cartItem->cart_id === $cart->id, 403);

        $cartItem->delete();

        return back()->with('success', 'Item removed.');
    }

    private function currentCart(Request $request, bool $createIfMissing = false): ?Cart
    {
        if ($request->user()) {
            $cart = Cart::firstOrNew(['user_id' => $request->user()->id]);
        } else {
            $sessionId = $request->session()->getId();
            $cart = Cart::firstOrNew(['session_id' => $sessionId]);
        }

        if (! $cart->exists && $createIfMissing) {
            $cart->save();
        }

        return $cart->exists ? $cart : null;
    }
}
