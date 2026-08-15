<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\TeamMember;
use App\Models\User;

class TeamMemberPolicy
{
    public function viewAny(User $user): bool
    {
        return $user->role === UserRole::Admin;
    }

    public function create(User $user): bool
    {
        return $user->role === UserRole::Admin;
    }

    public function update(User $user, TeamMember $teamMember): bool
    {
        return $user->role === UserRole::Admin;
    }

    public function delete(User $user, TeamMember $teamMember): bool
    {
        return $user->role === UserRole::Admin;
    }
}
