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
])]
class Setting extends Model
{
    public static function current(): self
    {
        return static::firstOrCreate([]);
    }
}
