<?php

namespace App\Enums;

enum ContactRequestStatus: string
{
    case New = 'new';
    case InProgress = 'in_progress';
    case Closed = 'closed';

    public function label(): string
    {
        return match ($this) {
            self::New => 'New',
            self::InProgress => 'In Progress',
            self::Closed => 'Closed',
        };
    }
}
