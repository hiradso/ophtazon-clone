<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\ContactRequest;
use App\Models\User;

class ContactRequestPolicy
{
    public function viewAny(User $user): bool
    {
        return in_array($user->role, [UserRole::Admin, UserRole::Staff], true);
    }

    public function view(User $user, ContactRequest $contactRequest): bool
    {
        if ($user->role === UserRole::Admin) {
            return true;
        }

        return $user->role === UserRole::Staff && $user->store_id === $contactRequest->store_id;
    }

    public function update(User $user, ContactRequest $contactRequest): bool
    {
        return $this->view($user, $contactRequest);
    }
}
