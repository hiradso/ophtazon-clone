<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'user_id',
    'full_name',
    'phone',
    'country_id',
    'city',
    'address_line',
    'postal_code',
    'is_default',
])]
class Address extends Model
{
    protected function casts(): array
    {
        return [
            'is_default' => 'boolean',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function country()
    {
        return $this->belongsTo(Country::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class, 'shipping_address_id');
    }
}
