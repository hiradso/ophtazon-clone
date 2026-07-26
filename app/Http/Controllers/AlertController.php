<?php

namespace App\Http\Controllers;

use App\Models\Alert;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class AlertController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'email', 'max:255'],
            'category_id' => ['nullable', 'integer', 'exists:categories,id'],
            'brand_id' => ['nullable', 'integer', 'exists:brands,id'],
            'max_price' => ['nullable', 'numeric', 'min:0'],
        ]);

        Alert::create([
            'user_id' => $request->user()?->id,
            'email' => $request->input('email'),
            'category_id' => $request->input('category_id'),
            'brand_id' => $request->input('brand_id'),
            'max_price' => $request->input('max_price'),
            'is_active' => true,
        ]);

        return back()->with('success', "We'll email you when a matching item is listed.");
    }
}
