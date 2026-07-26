<?php

namespace App\Http\Middleware;

use App\Enums\ContactRequestStatus;
use App\Enums\UserRole;
use App\Models\ContactRequest;
use Illuminate\Http\Request;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $request->user(),
            ],
            'flash' => [
                'success' => fn() => $request->session()->get('success'),
                'error' => fn() => $request->session()->get('error'),
            ],
            'newContactRequestsCount' => function () use ($request) {
                $user = $request->user();

                if (! $user || ! in_array($user->role, [UserRole::Admin, UserRole::Staff], true)) {
                    return 0;
                }

                return ContactRequest::query()
                    ->where('status', ContactRequestStatus::New)
                    ->when($user->role === UserRole::Staff, fn($query) => $query->where('store_id', $user->store_id))
                    ->count();
            },
        ];
    }
}
