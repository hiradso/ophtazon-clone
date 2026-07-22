<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreProductRequest;
use App\Http\Requests\Admin\UpdateProductRequest;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', Product::class);

        $products = Product::query()
            ->with(['category', 'brand', 'store'])
            ->when(auth()->user()->role === UserRole::Staff, function ($query) {
                $query->where('store_id', auth()->user()->store_id);
            })
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Product::class);

        return Inertia::render('Admin/Products/Create', [
            'categories' => Category::where('is_active', true)->get(['id', 'name']),
            'brands' => Brand::where('is_active', true)->get(['id', 'name']),
            'stores' => $this->availableStores(),
        ]);
    }

    public function store(StoreProductRequest $request): RedirectResponse
    {
        $product = Product::create([
            ...$request->validated(),
            'created_by' => auth()->id(),
        ]);

        return redirect()
            ->route('admin.products.edit', $product)
            ->with('success', 'Product created successfully.');
    }

    public function edit(Product $product): Response
    {
        $this->authorize('update', $product);

        return Inertia::render('Admin/Products/Edit', [
            'product' => $product->load(['images', 'allowedCountries']),
            'categories' => Category::where('is_active', true)->get(['id', 'name']),
            'brands' => Brand::where('is_active', true)->get(['id', 'name']),
            'stores' => $this->availableStores(),
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $product->update($request->validated());

        return redirect()
            ->route('admin.products.edit', $product)
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $this->authorize('delete', $product);

        $product->delete();

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'Product deleted successfully.');
    }

    private function availableStores()
    {
        $user = auth()->user();

        if ($user->role === UserRole::Admin) {
            return Store::where('is_active', true)->get(['id', 'name']);
        }

        return Store::where('id', $user->store_id)->get(['id', 'name']);
    }
}
