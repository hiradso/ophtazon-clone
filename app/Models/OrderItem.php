<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

#[Fillable([
    'order_id',
    'product_id',
    'product_reference_snapshot',
    'product_title_snapshot',
    'product_description_snapshot',
    'product_image_snapshot',
    'product_condition_snapshot',
    'unit_price',
    'quantity',
])]
class OrderItem extends Model
{
    use HasTranslations;

    public $translatable = ['product_title_snapshot', 'product_description_snapshot'];

    protected function casts(): array
    {
        return [
            'unit_price' => 'decimal:2',
            'quantity' => 'integer',
        ];
    }

    public function order()
    {
        return $this->belongsTo(Order::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
