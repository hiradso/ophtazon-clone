<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['site_name', 'logo', 'contact_email', 'contact_phone'])]
class Setting extends Model
{
    public static function current(): self
    {
        return static::firstOrCreate([]);
    }
}
