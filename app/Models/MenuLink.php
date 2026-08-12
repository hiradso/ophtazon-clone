<?php

namespace App\Models;

use Spatie\Translatable\HasTranslations;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['location', 'group_label', 'label', 'url', 'page_id', 'parent_id', 'sort_order', 'is_active'])]
class MenuLink extends Model
{
    use HasTranslations;

    protected array $translatable = ['label', 'group_label'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    public function page()
    {
        return $this->belongsTo(Page::class);
    }

    public function parent()
    {
        return $this->belongsTo(MenuLink::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(MenuLink::class, 'parent_id');
    }
}
