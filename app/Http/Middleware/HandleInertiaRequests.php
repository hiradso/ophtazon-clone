<?php

namespace App\Http\Middleware;

use App\Enums\ContactRequestStatus;
use App\Enums\UserRole;
use App\Models\Cart;
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
            'locale' => fn() => app()->getLocale(),
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
            'cartItemsCount' => function () use ($request) {
                $cart = $request->user()
                    ? Cart::where('user_id', $request->user()->id)->first()
                    : Cart::where('session_id', $request->session()->getId())->first();

                return $cart?->items()->count() ?? 0;
            },
            'headerLinks' => function () {
                return \App\Models\MenuLink::where('location', 'header')
                    ->where('is_active', true)
                    ->orderBy('sort_order')
                    ->get()
                    ->map(fn($link) => [
                        'label' => $link->getTranslations('label'),
                        'url' => $link->url,
                    ]);
            },
            'footerLinkGroups' => function () {
                return \App\Models\MenuLink::where('location', 'footer')
                    ->where('is_active', true)
                    ->orderBy('sort_order')
                    ->get()
                    ->groupBy(fn($link) => $link->getTranslation('group_label', 'en'))
                    ->map(fn($links) => [
                        'group_label' => $links->first()->getTranslations('group_label'),
                        'links' => $links->map(fn($link) => [
                            'label' => $link->getTranslations('label'),
                            'url' => $link->url,
                        ])->values(),
                    ])
                    ->values();
            },
            'siteSettings' => function () {
                return \App\Models\Setting::current();
            },
        ];
    }
}
