<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\User;

class SettingPolicy
{
    public function view(User $user): bool
    {
        return $user->role === UserRole::Admin;
    }

    public function update(User $user): bool
    {
        return $user->role === UserRole::Admin;
    }
}
