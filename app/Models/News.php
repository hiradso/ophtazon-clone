<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;
use Spatie\Translatable\HasTranslations;

#[Fillable(['title', 'content', 'slug', 'cover_image', 'author_id', 'published_at'])]
class News extends Model
{
    use HasTranslations;

    public $translatable = ['title', 'content'];

    protected function casts(): array
    {
        return [
            'published_at' => 'datetime',
        ];
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'author_id');
    }
}
