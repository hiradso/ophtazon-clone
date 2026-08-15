<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

#[Fillable(['name', 'issuing_body', 'description', 'image', 'sort_order', 'is_active'])]
class Certification extends Model
{
    use HasTranslations;

    public $translatable = ['name', 'issuing_body', 'description'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }
}
