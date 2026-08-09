<?php

namespace Database\Seeders;

use App\Models\Brand;
use App\Models\Category;
use App\Models\Country;
use App\Models\Media;
use App\Models\Product;
use App\Models\ProductImage;
use App\Models\Store;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DemoDataSeeder extends Seeder
{
    public function run(): void
    {
        // ۱. دسته‌بندی‌ها
        $categoriesData = [
            ['en' => 'Autorefractor', 'fa' => 'اتورفرکتور'],
            ['en' => 'Slit Lamp', 'fa' => 'اسلیت لمپ'],
            ['en' => 'OCT (Optical Coherence Tomography)', 'fa' => 'او‌سی‌تی'],
            ['en' => 'Tonometer', 'fa' => 'تونومتر'],
            ['en' => 'Phoropter', 'fa' => 'فوروپتر'],
            ['en' => 'Fundus Camera', 'fa' => 'دوربین فوندوس'],
            ['en' => 'Operating Microscope', 'fa' => 'میکروسکوپ جراحی'],
            ['en' => 'Ultrasound (A/B Scan)', 'fa' => 'سونوگرافی چشم'],
        ];

        $categories = collect($categoriesData)->map(function ($cat, $index) {
            return Category::create([
                'name' => ['en' => $cat['en'], 'fa' => $cat['fa']],
                'slug' => Str::slug($cat['en']),
                'is_active' => true,
                'sort_order' => $index,
            ]);
        });

        // ۲. برندها
        $brandNames = ['Zeiss', 'Topcon', 'Nidek', 'Haag-Streit', 'Canon'];
        $brands = collect($brandNames)->map(function ($name) {
            return Brand::create([
                'name' => $name,
                'is_active' => true,
            ]);
        });

        // ۳. فروشگاه — از اولین کشور موجود در دیتابیس استفاده می‌کند
        $country = Country::first();

        $store = Store::create([
            'name' => 'Ophtazon',
            'slug' => 'ophtazon',
            'country_id' => $country?->id,
            'address' => null,
            'phone' => null,
            'email' => 'contact@ophtazon.com',
            'is_active' => true,
        ]);

        // ۴. عکس‌های موجود در کتابخانه‌ی رسانه — برای استفاده به‌عنوان تصویر محصولات
        $mediaPaths = Media::pluck('path')->values();

        if ($mediaPaths->isEmpty()) {
            $this->command->warn('هیچ عکسی در کتابخانه‌ی رسانه پیدا نشد — محصولات بدون عکس ساخته می‌شوند.');
        }

        // ۵. محصولات نمونه — عنوان/توضیحات به هر دو زبان انگلیسی و فارسی
        $productsData = [
            [
                'title_en' => 'Zeiss Humphrey Field Analyzer 3',
                'title_fa' => 'دستگاه پریمتری زایس همفری فیلد آنالایزر ۳',
                'desc_en' => 'Advanced visual field analyzer used for glaucoma diagnosis and monitoring. Fully tested and calibrated, in excellent working condition.',
                'desc_fa' => 'دستگاه پیشرفته‌ی بررسی میدان بینایی، مورد استفاده برای تشخیص و پایش گلوکوم. کاملاً تست و کالیبره شده، در وضعیت عملکردی عالی.',
                'category' => 'Autorefractor',
                'brand' => 'Zeiss',
                'price' => 8500,
                'condition' => 'used',
            ],
            [
                'title_en' => 'Topcon SL-D701 Slit Lamp',
                'title_fa' => 'اسلیت لمپ توپکان مدل SL-D701',
                'desc_en' => 'High-resolution digital slit lamp with integrated imaging system. Ideal for comprehensive anterior segment examination.',
                'desc_fa' => 'اسلیت لمپ دیجیتال با وضوح بالا و سیستم تصویربرداری یکپارچه. مناسب برای معاینه‌ی کامل بخش قدامی چشم.',
                'category' => 'Slit Lamp',
                'brand' => 'Topcon',
                'price' => 6200,
                'condition' => 'used',
            ],
            [
                'title_en' => 'Nidek RS-3000 Advance 2 OCT',
                'title_fa' => 'دستگاه او‌سی‌تی نیدک مدل RS-3000 Advance 2',
                'desc_en' => 'High-speed OCT with color fundus imaging, widely used for retinal and glaucoma assessment.',
                'desc_fa' => 'دستگاه او‌سی‌تی با سرعت بالا و تصویربرداری رنگی فوندوس، به‌طور گسترده برای بررسی شبکیه و گلوکوم استفاده می‌شود.',
                'category' => 'OCT (Optical Coherence Tomography)',
                'brand' => 'Nidek',
                'price' => 24500,
                'condition' => 'used',
            ],
            [
                'title_en' => 'Haag-Streit AT 900 Tonometer',
                'title_fa' => 'تونومتر هاگ-اشتریت مدل AT 900',
                'desc_en' => 'Gold-standard applanation tonometer for accurate intraocular pressure measurement, mounted on slit lamp.',
                'desc_fa' => 'تونومتر اپلاناسیون با استاندارد طلایی برای اندازه‌گیری دقیق فشار داخل چشم، قابل‌نصب روی اسلیت لمپ.',
                'category' => 'Tonometer',
                'brand' => 'Haag-Streit',
                'price' => 3100,
                'condition' => 'refurbished',
            ],
            [
                'title_en' => 'Canon CR-2 AF Fundus Camera',
                'title_fa' => 'دوربین فوندوس کانن مدل CR-2 AF',
                'desc_en' => 'Non-mydriatic auto-focus fundus camera for high-quality retinal photography without pupil dilation.',
                'desc_fa' => 'دوربین فوندوس با فوکوس خودکار و بدون نیاز به گشادکردن مردمک، برای عکاسی باکیفیت از شبکیه.',
                'category' => 'Fundus Camera',
                'brand' => 'Canon',
                'price' => 9800,
                'condition' => 'used',
            ],
            [
                'title_en' => 'Zeiss OPMI Lumera 700 Operating Microscope',
                'title_fa' => 'میکروسکوپ جراحی زایس مدل OPMI Lumera 700',
                'desc_en' => 'Premium ophthalmic surgical microscope with superior optics, used in cataract and retinal surgery.',
                'desc_fa' => 'میکروسکوپ جراحی چشم‌پزشکی درجه‌یک با نوری‌شناسی برتر، مورد استفاده در جراحی کاتاراکت و شبکیه.',
                'category' => 'Operating Microscope',
                'brand' => 'Zeiss',
                'price' => 45000,
                'condition' => 'used',
            ],
        ];

        foreach ($productsData as $index => $data) {
            $category = $categories->firstWhere('slug', Str::slug($data['category']));
            $brand = $brands->firstWhere('name', $data['brand']);

            $product = Product::create([
                'reference' => 'OPH-' . strtoupper(Str::random(6)),
                'title' => ['en' => $data['title_en'], 'fa' => $data['title_fa']],
                'description' => ['en' => $data['desc_en'], 'fa' => $data['desc_fa']],
                'slug' => Str::slug($data['title_en']) . '-' . Str::random(4),
                'category_id' => $category?->id,
                'brand_id' => $brand?->id,
                'store_id' => $store->id,
                'condition' => $data['condition'],
                'status' => 'available',
                'price' => $data['price'],
                'currency' => 'EUR',
                'manufacture_year' => now()->year - rand(1, 5),
                'warranty_months' => 12,
                'is_checked' => true,
                'stock_quantity' => 1,
            ]);

            if ($mediaPaths->isNotEmpty()) {
                ProductImage::create([
                    'product_id' => $product->id,
                    'url' => $mediaPaths->get($index % $mediaPaths->count()),
                    'position' => 0,
                ]);
            }
        }

        $this->command->info('داده‌های نمونه با موفقیت ساخته شدند: ' . $categories->count() . ' دسته‌بندی، ' . $brands->count() . ' برند، ۱ فروشگاه، ' . count($productsData) . ' محصول.');
    }
}
