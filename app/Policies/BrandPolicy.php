<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Brand;
use App\Models\User;

class BrandPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role === UserRole::Admin;
    }

    public function create(User $user): bool
    {
        return $user->role === UserRole::Admin;
    }

    public function update(User $user, Brand $brand): bool
    {
        return $user->role === UserRole::Admin;
    }

    public function delete(User $user, Brand $brand): bool
    {
        return $user->role === UserRole::Admin;
    }
}
