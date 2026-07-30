<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['filename', 'path', 'mime_type', 'size', 'alt_text', 'uploaded_by'])]
class Media extends Model
{
    public function uploader()
    {
        return $this->belongsTo(User::class, 'uploaded_by');
    }
}
