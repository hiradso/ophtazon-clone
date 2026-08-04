<?php

namespace App\Models;

use App\Enums\ProductCondition;
use App\Enums\ProductStatus;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Translatable\HasTranslations;

#[Fillable([
    'reference',
    'title',
    'description',
    'slug',
    'category_id',
    'brand_id',
    'store_id',
    'created_by',
    'condition',
    'status',
    'price',
    'currency',
    'manufacture_year',
    'warranty_months',
    'is_checked',
    'attributes',
    'published_at',
    'stock_quantity',
    'discount_percentage',
    'meta_title',
    'meta_description',
    'og_image',
])]
class Product extends Model
{
    use HasTranslations, SoftDeletes;

    public $translatable = ['title', 'description', 'meta_title', 'meta_description'];

    /**
     * effective_price همیشه به همراه هر سریالایز مدل فرستاده می‌شود —
     * این تنها منبع حقیقت برای «قیمتی که واقعاً باید پرداخت شود» است،
     * چه در نمایش (کارت محصول، صفحه‌ی جزئیات) چه در محاسبات واقعی
     * (سبد خرید، چک‌اوت، ثبت سفارش).
     */
    protected $appends = ['effective_price'];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'is_checked' => 'boolean',
            'attributes' => 'array',
            'published_at' => 'datetime',
            'manufacture_year' => 'integer',
            'warranty_months' => 'integer',
            'views_count' => 'integer',
            'stock_quantity' => 'integer',
            'discount_percentage' => 'integer',
            'status' => ProductStatus::class,
            'condition' => ProductCondition::class,
        ];
    }

    protected function effectivePrice(): Attribute
    {
        return Attribute::make(
            get: fn() => $this->discount_percentage
                ? round($this->price * (1 - $this->discount_percentage / 100), 2)
                : (float) $this->price,
        );
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function brand()
    {
        return $this->belongsTo(Brand::class);
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function creator()
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function images()
    {
        return $this->hasMany(ProductImage::class)->orderBy('position');
    }

    public function allowedCountries()
    {
        return $this->belongsToMany(Country::class, 'product_countries');
    }

    public function cartItems()
    {
        return $this->hasMany(CartItem::class);
    }

    public function orderItems()
    {
        return $this->hasMany(OrderItem::class);
    }
}
