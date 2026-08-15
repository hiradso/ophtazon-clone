<?php

namespace App\Http\Controllers;

use App\Enums\ProductStatus;
use App\Models\Category;
use App\Models\Page;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class HtmlSitemapController extends Controller
{
    public function index(): Response
    {
        $categories = Category::where('is_active', true)
            ->orderBy('sort_order')
            ->get(['id', 'name', 'slug']);

        $products = Product::where('status', ProductStatus::Available)
            ->orderBy('created_at', 'desc')
            ->get(['id', 'title', 'slug', 'category_id']);

        $categorySections = $categories->map(function ($category) use ($products) {
            return [
                'id' => $category->id,
                'name' => $category->name,
                'slug' => $category->slug,
                'products' => $products
                    ->where('category_id', $category->id)
                    ->map(fn ($product) => [
                        'title' => $product->title,
                        'slug' => $product->slug,
                    ])
                    ->values(),
            ];
        });

        $uncategorizedProducts = $products
            ->whereNotIn('category_id', $categories->pluck('id'))
            ->map(fn ($product) => [
                'title' => $product->title,
                'slug' => $product->slug,
            ])
            ->values();

        $pages = Page::where('is_published', true)
            ->orderBy('title')
            ->get(['title', 'slug']);

        return Inertia::render('Sitemap/Index', [
            'categorySections' => $categorySections,
            'uncategorizedProducts' => $uncategorizedProducts,
            'pages' => $pages,
        ]);
    }
}
