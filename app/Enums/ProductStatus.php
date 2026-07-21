<?php

namespace App\Enums;

enum ProductStatus: string
{
    case Draft = 'draft';
    case PendingReview = 'pending_review';
    case Available = 'available';
    case Reserved = 'reserved';
    case Sold = 'sold';
    case Archived = 'archived';

    public function label(): string
    {
        return match ($this) {
            self::Draft => 'Draft',
            self::PendingReview => 'Pending Review',
            self::Available => 'Available',
            self::Reserved => 'Reserved',
            self::Sold => 'Sold',
            self::Archived => 'Archived',
        };
    }
}
