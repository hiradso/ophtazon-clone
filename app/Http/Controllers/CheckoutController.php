<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Country;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function index(Request $request): Response
    {
        $cart = $request->user()
            ? Cart::where('user_id', $request->user()->id)->first()
            : Cart::where('session_id', $request->session()->getId())->first();

        abort_if(! $cart || $cart->items()->count() === 0, 404);

        return Inertia::render('Checkout/Index', [
            'cart' => $cart->load(['items.product.images', 'items.product.store']),
            'countries' => Country::where('is_active', true)->get(['id', 'name', 'iso_code']),
        ]);
    }
}
