<?php

namespace App\Http\Middleware;

use App\Enums\ContactRequestStatus;
use App\Enums\UserRole;
use App\Models\Cart;
use App\Models\ContactRequest;
use App\Models\MenuLink;
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
            'appUrl' => fn() => config('app.url'),
            'ziggy' => fn() => [
                ...(new \Tighten\Ziggy\Ziggy)->toArray(),
                'location' => $request->url(),
            ],
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
                return MenuLink::where('location', 'header')
                    ->where('is_active', true)
                    ->whereNull('parent_id')
                    ->with([
                        'page:id,slug',
                        'children' => fn($query) => $query->where('is_active', true)
                            ->orderBy('sort_order')
                            ->with('page:id,slug'),
                    ])
                    ->orderBy('sort_order')
                    ->get()
                    ->map(fn($link) => [
                        ...$this->mapMenuLink($link),
                        'children' => $link->children->map(fn($child) => $this->mapMenuLink($child)),
                    ]);
            },
            'footerLinkGroups' => function () {
                return MenuLink::where('location', 'footer')
                    ->where('is_active', true)
                    ->whereNull('parent_id')
                    ->with('page:id,slug')
                    ->orderBy('sort_order')
                    ->get()
                    ->groupBy(fn($link) => $link->getTranslation('group_label', 'en'))
                    ->map(fn($links) => [
                        'group_label' => $links->first()->getTranslations('group_label'),
                        'links' => $links->map(fn($link) => $this->mapMenuLink($link))->values(),
                    ])
                    ->values();
            },
            'siteSettings' => function () {
                return \App\Models\Setting::current();
            },
        ];
    }

    /**
     * لینک‌های منو یا آدرس دستی دارن یا مستقیم به یک Page وصلن — چون
     * صفحات پشت پیشوند زبان‌ان (/{locale}/pages/{slug})، فرانت‌اند با
     * داشتن page_slug باید خودش آدرس نهایی رو با locale فعلی بسازه.
     */
    private function mapMenuLink(MenuLink $link): array
    {
        return [
            'id' => $link->id,
            'label' => $link->getTranslations('label'),
            'url' => $link->url,
            'page_slug' => $link->page?->slug,
        ];
    }
}
