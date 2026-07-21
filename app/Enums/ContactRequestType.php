<?php

namespace App\Enums;

enum ContactRequestType: string
{
    case Contact = 'contact';
    case CallbackRequest = 'callback_request';
    case QuoteRequest = 'quote_request';

    public function label(): string
    {
        return match ($this) {
            self::Contact => 'Contact',
            self::CallbackRequest => 'Callback Request',
            self::QuoteRequest => 'Quote Request',
        };
    }
}
