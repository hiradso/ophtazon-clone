<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Certification;
use App\Models\User;

class CertificationPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role === UserRole::Admin;
    }

    public function create(User $user): bool
    {
        return $user->role === UserRole::Admin;
    }

    public function update(User $user, Certification $certification): bool
    {
        return $user->role === UserRole::Admin;
    }

    public function delete(User $user, Certification $certification): bool
    {
        return $user->role === UserRole::Admin;
    }
}
