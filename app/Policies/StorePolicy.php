<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Store;
use App\Models\User;

class StorePolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role === UserRole::Admin;
    }

    public function create(User $user): bool
    {
        return $user->role === UserRole::Admin;
    }

    public function update(User $user, Store $store): bool
    {
        return $user->role === UserRole::Admin;
    }

    public function delete(User $user, Store $store): bool
    {
        return $user->role === UserRole::Admin;
    }
}
