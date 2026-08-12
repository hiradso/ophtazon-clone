<?php

namespace App\Models;

use Spatie\Translatable\HasTranslations;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['parent_id', 'title', 'slug', 'content', 'featured_image', 'image_display_style', 'meta_description', 'is_published'])]
class Page extends Model
{
    use HasTranslations;

    protected array $translatable = ['title', 'content', 'meta_description'];

    protected function casts(): array
    {
        return [
            'is_published' => 'boolean',
        ];
    }

    public function parent()
    {
        return $this->belongsTo(Page::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Page::class, 'parent_id');
    }
}
