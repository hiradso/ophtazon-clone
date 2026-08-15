<?php

namespace App\Http\Controllers;

use App\Enums\ProductStatus;
use App\Models\Category;
use App\Models\Page;
use App\Models\Product;
use Illuminate\Http\Response;

class SitemapController extends Controller
{
    private const LOCALES = ['en', 'fr', 'fa'];

    public function index(): Response
    {
        $urls = collect();

        // این روت‌ها همه پیشوند {locale} دارن و بیرون از گروه میدل‌ور
        // SetLocaleFromUrl اجرا می‌شن (چون sitemap.xml خودش بدون پیشوند
        // زبانه)، پس URL::defaults() هیچ‌وقت ست نشده و route() بدون
        // locale صریح کرش می‌کنه — برای همین هر URL رو برای هر سه زبان
        // جداگانه با locale صریح می‌سازیم.
        foreach (self::LOCALES as $locale) {
            $urls->push([
                'loc' => route('welcome', ['locale' => $locale]),
                'priority' => '1.0',
                'changefreq' => 'daily',
            ]);
            $urls->push([
                'loc' => route('products.index', ['locale' => $locale]),
                'priority' => '0.9',
                'changefreq' => 'daily',
            ]);
            $urls->push([
                'loc' => route('team.index', ['locale' => $locale]),
                'priority' => '0.5',
                'changefreq' => 'monthly',
            ]);
        }

        // محصولات موجود
        Product::query()
            ->where('status', ProductStatus::Available)
            ->select(['slug', 'updated_at'])
            ->chunk(200, function ($products) use ($urls) {
                foreach ($products as $product) {
                    foreach (self::LOCALES as $locale) {
                        $urls->push([
                            'loc' => route('products.show', [
                                'locale' => $locale,
                                'product' => $product->slug,
                            ]),
                            'lastmod' => $product->updated_at->toAtomString(),
                            'priority' => '0.8',
                            'changefreq' => 'weekly',
                        ]);
                    }
                }
            });

        // دسته‌بندی‌ها (به‌عنوان لینک فیلترشده‌ی صفحه‌ی محصولات)
        Category::where('is_active', true)->each(function ($category) use ($urls) {
            foreach (self::LOCALES as $locale) {
                $urls->push([
                    'loc' => route('products.index', [
                        'locale' => $locale,
                        'category' => $category->slug,
                    ]),
                    'priority' => '0.6',
                    'changefreq' => 'weekly',
                ]);
            }
        });

        // صفحات ثابت منتشرشده
        Page::where('is_published', true)
            ->select(['slug', 'updated_at'])
            ->each(function ($page) use ($urls) {
                foreach (self::LOCALES as $locale) {
                    $urls->push([
                        'loc' => route('pages.show', [
                            'locale' => $locale,
                            'page' => $page->slug,
                        ]),
                        'lastmod' => $page->updated_at->toAtomString(),
                        'priority' => '0.5',
                        'changefreq' => 'monthly',
                    ]);
                }
            });

        $xml = view('sitemap', ['urls' => $urls])->render();

        return response($xml, 200)->header('Content-Type', 'text/xml');
    }
}
