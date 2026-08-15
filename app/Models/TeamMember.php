<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

#[Fillable(['name', 'role_title', 'bio', 'photo', 'sort_order', 'is_active'])]
class TeamMember extends Model
{
    use HasTranslations;

    public $translatable = ['name', 'role_title', 'bio'];

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }
}
