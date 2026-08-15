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

        // نکته‌ی مهم: دسترسی مستقیم به $category->name (getter جادویی)
        // اسپیشیتی رو مجبور می‌کنه فقط ترجمه‌ی locale فعلی رو برگردونه (یه
        // رشته‌ی ساده)، در حالی که فرانت‌اند (تابع t()) انتظار آبجکت کامل
        // {en, fr, fa} رو داره — دقیقاً همون چیزی که وقتی خود مدل مستقیم به
        // عنوان prop اینرشیا پاس داده می‌شه serialize می‌شه. برای همین اینجا
        // صریحاً از getTranslations() استفاده می‌کنیم تا آبجکت کامل بمونه.
        $categorySections = $categories->map(function ($category) use ($products) {
            return [
                'id' => $category->id,
                'name' => $category->getTranslations('name'),
                'slug' => $category->slug,
                'products' => $products
                    ->where('category_id', $category->id)
                    ->map(fn ($product) => [
                        'title' => $product->getTranslations('title'),
                        'slug' => $product->slug,
                    ])
                    ->values(),
            ];
        });

        $uncategorizedProducts = $products
            ->whereNotIn('category_id', $categories->pluck('id'))
            ->map(fn ($product) => [
                'title' => $product->getTranslations('title'),
                'slug' => $product->slug,
            ])
            ->values();

        $pages = Page::where('is_published', true)
            ->orderBy('slug')
            ->get(['title', 'slug'])
            ->map(fn ($page) => [
                'title' => $page->getTranslations('title'),
                'slug' => $page->slug,
            ]);

        return Inertia::render('Sitemap/Index', [
            'categorySections' => $categorySections,
            'uncategorizedProducts' => $uncategorizedProducts,
            'pages' => $pages,
        ]);
    }
}
