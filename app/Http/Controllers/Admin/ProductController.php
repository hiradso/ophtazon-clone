<?php

namespace App\Http\Controllers\Admin;

use App\Models\Country;
use App\Models\ProductImage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
            ->with(['category', 'brand', 'store', 'images'])
            ->when(auth()->user()->role === UserRole::Staff, function ($query) {
                $query->where('store_id', auth()->user()->store_id);
            })
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/Products/Index', [
            'products' => $products,
        ]);
    }
    public function show(Product $product): Response
    {
        $this->authorize('view', $product);

        return Inertia::render('Admin/Products/Show', [
            'product' => $product->load(['images', 'category', 'brand', 'store', 'allowedCountries']),
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
            ->with('success', 'product_created_success');
    }

    public function edit(Product $product): Response
    {
        $this->authorize('update', $product);

        return Inertia::render('Admin/Products/Edit', [
            'product' => $product->load(['images', 'allowedCountries']),
            'categories' => Category::where('is_active', true)->get(['id', 'name']),
            'brands' => Brand::where('is_active', true)->get(['id', 'name']),
            'stores' => $this->availableStores(),
            'allCountries' => Country::where('is_active', true)->get(['id', 'name']),
        ]);
    }

    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $product->update($request->validated());

        return redirect()
            ->route('admin.products.index', $product)
            ->with('success', 'product_updated_success');
    }

    public function destroy(Product $product): RedirectResponse
    {
        $this->authorize('delete', $product);

        $product->delete();

        return redirect()
            ->route('admin.products.index')
            ->with('success', 'product_deleted_success');
    }
    public function storeImage(Request $request, Product $product): RedirectResponse
    {
        $this->authorize('update', $product);

        $request->validate([
            'path' => ['required', 'string', 'max:255'],
        ]);

        $nextPosition = $product->images()->max('position');
        $nextPosition = is_null($nextPosition) ? 0 : $nextPosition + 1;

        $product->images()->create([
            'url' => $request->input('path'),
            'position' => $nextPosition,
        ]);

        return back()->with('success', 'product_image_added');
    }

    public function destroyImage(Product $product, ProductImage $image): RedirectResponse
    {
        $this->authorize('update', $product);

        $image->delete();

        return back()->with('success', 'product_image_removed');
    }

    public function storeBrochure(Request $request, Product $product): RedirectResponse
    {
        $this->authorize('update', $product);

        $request->validate([
            'brochure' => ['required', 'file', 'mimes:pdf', 'max:10240'],
        ]);

        if ($product->brochure_path) {
            Storage::disk('public')->delete($product->brochure_path);
        }

        $file = $request->file('brochure');
        $path = $file->store('brochures', 'public');

        $product->update([
            'brochure_path' => $path,
            'brochure_original_name' => $file->getClientOriginalName(),
        ]);

        return back()->with('success', 'product_brochure_uploaded');
    }

    public function destroyBrochure(Product $product): RedirectResponse
    {
        $this->authorize('update', $product);

        if ($product->brochure_path) {
            Storage::disk('public')->delete($product->brochure_path);
        }

        $product->update([
            'brochure_path' => null,
            'brochure_original_name' => null,
        ]);

        return back()->with('success', 'product_brochure_removed');
    }

    public function syncCountries(Request $request, Product $product): RedirectResponse
    {
        $this->authorize('update', $product);

        $request->validate([
            'country_ids' => ['array'],
            'country_ids.*' => ['integer', 'exists:countries,id'],
        ]);

        $product->allowedCountries()->sync($request->input('country_ids', []));

        return back()->with('success', 'product_country_restrictions_updated');
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
