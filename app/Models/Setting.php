<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'site_name',
    'logo',
    'contact_email',
    'contact_phone',
    'font_latin',
    'font_persian',
    'slogan',
])]
class Setting extends Model
{
    protected function casts(): array
    {
        return [
            'slogan' => 'array',
        ];
    }

    public static function current(): self
    {
        return static::firstOrCreate([]);
    }
}
