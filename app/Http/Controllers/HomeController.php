<?php

namespace App\Http\Controllers;

use App\Enums\ProductStatus;
use App\Models\Category;
use App\Models\PageSection;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class HomeController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Welcome', [
            'sections' => PageSection::where('is_active', true)
                ->orderBy('sort_order')
                ->get(['id', 'type', 'content']),
            'categories' => Category::where('is_active', true)
                ->whereNull('parent_id')
                ->orderBy('sort_order')
                ->get(['id', 'name', 'slug', 'icon_url']),
            'latestProducts' => Product::query()
                ->where('status', ProductStatus::Available)
                ->with(['images', 'store'])
                ->latest('published_at')
                ->limit(8)
                ->get(),
            'discountedProducts' => Product::query()
                ->where('status', ProductStatus::Available)
                ->whereNotNull('discount_percentage')
                ->where('discount_percentage', '>', 0)
                ->with(['images', 'store'])
                ->orderByDesc('discount_percentage')
                ->limit(10)
                ->get(),
        ]);
    }
}
