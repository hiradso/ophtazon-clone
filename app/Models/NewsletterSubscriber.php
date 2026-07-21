<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Model;

#[Fillable(['email', 'locale', 'source', 'unsubscribe_token', 'is_subscribed', 'unsubscribed_at'])]
#[Hidden(['unsubscribe_token'])]
class NewsletterSubscriber extends Model
{
    protected function casts(): array
    {
        return [
            'is_subscribed' => 'boolean',
            'unsubscribed_at' => 'datetime',
        ];
    }
}
