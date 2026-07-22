<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Product;
use App\Models\User;

class ProductPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, [UserRole::Admin, UserRole::Staff], true);
    }

    public function view(User $user, Product $product): bool
    {
        if ($user->role === UserRole::Admin) {
            return true;
        }

        return $user->role === UserRole::Staff && $user->store_id === $product->store_id;
    }

    public function create(User $user): bool
    {
        return in_array($user->role, [UserRole::Admin, UserRole::Staff], true);
    }

    public function update(User $user, Product $product): bool
    {
        if ($user->role === UserRole::Admin) {
            return true;
        }

        return $user->role === UserRole::Staff && $user->store_id === $product->store_id;
    }

    public function delete(User $user, Product $product): bool
    {
        return $this->update($user, $product);
    }

    public function restore(User $user, Product $product): bool
    {
        return $user->role === UserRole::Admin;
    }

    public function forceDelete(User $user, Product $product): bool
    {
        return $user->role === UserRole::Admin;
    }
}
