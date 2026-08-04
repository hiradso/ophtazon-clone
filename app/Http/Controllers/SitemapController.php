<?php

namespace App\Http\Controllers;

use App\Enums\ProductStatus;
use App\Models\Category;
use App\Models\Page;
use App\Models\Product;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    public function index(): Response
    {
        $urls = collect();

        // صفحات ثابتِ همیشگی سایت
        $urls->push([
            'loc' => route('welcome'),
            'priority' => '1.0',
            'changefreq' => 'daily',
        ]);
        $urls->push([
            'loc' => route('products.index'),
            'priority' => '0.9',
            'changefreq' => 'daily',
        ]);

        // محصولات موجود
        Product::query()
            ->where('status', ProductStatus::Available)
            ->select(['slug', 'updated_at'])
            ->chunk(200, function ($products) use ($urls) {
                foreach ($products as $product) {
                    $urls->push([
                        'loc' => route('products.show', $product->slug),
                        'lastmod' => $product->updated_at->toAtomString(),
                        'priority' => '0.8',
                        'changefreq' => 'weekly',
                    ]);
                }
            });

        // دسته‌بندی‌ها (به‌عنوان لینک فیلترشده‌ی صفحه‌ی محصولات)
        Category::where('is_active', true)->each(function ($category) use ($urls) {
            $urls->push([
                'loc' => route('products.index', ['category' => $category->slug]),
                'priority' => '0.6',
                'changefreq' => 'weekly',
            ]);
        });

        // صفحات ثابت منتشرشده
        Page::where('is_published', true)
            ->select(['slug', 'updated_at'])
            ->each(function ($page) use ($urls) {
                $urls->push([
                    'loc' => route('pages.show', $page->slug),
                    'lastmod' => $page->updated_at->toAtomString(),
                    'priority' => '0.5',
                    'changefreq' => 'monthly',
                ]);
            });

        $xml = view('sitemap', ['urls' => $urls])->render();

        return response($xml, 200)->header('Content-Type', 'text/xml');
    }
}
