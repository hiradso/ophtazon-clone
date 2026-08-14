<?php

namespace App\Http\Controllers;

use App\Enums\ProductStatus;
use App\Models\Brand;
use App\Models\Category;
use App\Models\Product;
use App\Models\Store;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ProductController extends Controller
{
    public function index(Request $request): Response
    {
        $products = Product::query()
            ->where('status', ProductStatus::Available)
            ->with(['category', 'brand', 'store', 'images'])
            ->when($request->filled('category'), function ($query) use ($request) {
                $query->whereHas('category', fn($q) => $q->where('slug', $request->input('category')));
            })
            ->when($request->filled('brand'), function ($query) use ($request) {
                $query->where('brand_id', $request->input('brand'));
            })
            ->when($request->filled('store'), function ($query) use ($request) {
                $query->where('store_id', $request->input('store'));
            })
            ->when($request->filled('condition'), function ($query) use ($request) {
                $query->where('condition', $request->input('condition'));
            })
            ->when($request->filled('min_price'), function ($query) use ($request) {
                $query->where('price', '>=', $request->input('min_price'));
            })
            ->when($request->filled('max_price'), function ($query) use ($request) {
                $query->where('price', '<=', $request->input('max_price'));
            })
            ->when($request->filled('q'), function ($query) use ($request) {
                $search = $request->input('q');
                $query->where('title->en', 'ilike', "%{$search}%");
            })
            ->latest('published_at')
            ->paginate(12)
            ->withQueryString();

        return Inertia::render('Products/Index', [
            'products' => $products,
            'categories' => Category::where('is_active', true)->orderBy('sort_order')->get(['id', 'name', 'slug']),
            'brands' => Brand::where('is_active', true)->orderBy('name')->get(['id', 'name']),
            'stores' => Store::where('is_active', true)->get(['id', 'name']),
            'filters' => $request->only(['category', 'brand', 'store', 'condition', 'min_price', 'max_price', 'q']),
        ]);
    }

    public function show(): Response
    {
        $product = Product::where('slug', request()->route('product'))->firstOrFail();

        abort_unless($product->status === ProductStatus::Available, 404);

        $relatedProducts = $this->findRelatedProducts($product);

        return Inertia::render('Products/Show', [
            'product' => $product->load(['category', 'brand', 'store.country', 'images']),
            'relatedProducts' => $relatedProducts,
        ]);
    }

    /**
     * دنبال محصولات مشابه می‌گردد — اول هم‌دسته، اگر چیزی نبود
     * هم‌برند، اگر بازهم چیزی نبود هم‌فروشگاه. هدف این است که
     * کاروسل «محصولات مرتبط» فقط وقتی کاملاً خالی بماند که واقعاً
     * هیچ محصول قابل‌مقایسه‌ای در کل سایت نباشد.
     */
    private function findRelatedProducts(Product $product)
    {
        $base = fn() => Product::query()
            ->where('status', ProductStatus::Available)
            ->where('id', '!=', $product->id)
            ->with(['images']);

        $related = $base()
            ->where('category_id', $product->category_id)
            ->latest('published_at')
            ->limit(8)
            ->get();

        if ($related->isEmpty() && $product->brand_id) {
            $related = $base()
                ->where('brand_id', $product->brand_id)
                ->latest('published_at')
                ->limit(8)
                ->get();
        }

        if ($related->isEmpty()) {
            $related = $base()
                ->where('store_id', $product->store_id)
                ->latest('published_at')
                ->limit(8)
                ->get();
        }

        return $related;
    }
}
