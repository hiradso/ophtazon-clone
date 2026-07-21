<?php

namespace App\Models;

use App\Enums\ContactRequestStatus;
use App\Enums\ContactRequestType;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Model;

#[Fillable([
    'type',
    'name',
    'email',
    'phone',
    'message',
    'attachment_path',
    'store_id',
    'product_id',
    'status',
    'handled_by',
    'reply_message',
    'replied_at',
    'locale',
    'source_url',
    'ip_address',
])]
class ContactRequest extends Model
{
    protected function casts(): array
    {
        return [
            'type' => ContactRequestType::class,
            'status' => ContactRequestStatus::class,
            'replied_at' => 'datetime',
        ];
    }

    public function store()
    {
        return $this->belongsTo(Store::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function handler()
    {
        return $this->belongsTo(User::class, 'handled_by');
    }
}
