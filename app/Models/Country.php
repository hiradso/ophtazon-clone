<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['name', 'iso_code', 'currency_code', 'phone_prefix', 'is_active'])]
class Country extends Model
{
    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function stores()
    {
        return $this->hasMany(Store::class);
    }

    public function users()
    {
        return $this->hasMany(User::class);
    }

    public function addresses()
    {
        return $this->hasMany(Address::class);
    }
}
