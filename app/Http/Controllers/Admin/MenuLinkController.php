<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreMenuLinkRequest;
use App\Http\Requests\Admin\UpdateMenuLinkRequest;
use App\Models\MenuLink;
use App\Models\Page;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MenuLinkController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', MenuLink::class);

        return Inertia::render('Admin/MenuLinks/Index', [
            'menuLinks' => MenuLink::with('page:id,title')
                ->orderBy('location')
                ->orderBy('sort_order')
                ->get(),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', MenuLink::class);

        return Inertia::render('Admin/MenuLinks/Create', [
            'pageOptions' => Page::orderBy('title')->get(['id', 'title', 'slug']),
            'parentOptions' => MenuLink::whereNull('parent_id')->orderBy('location')->orderBy('sort_order')->get(['id', 'label', 'location']),
            'footerGroupOptions' => $this->footerGroupOptions(),
        ]);
    }

    public function store(StoreMenuLinkRequest $request): RedirectResponse
    {
        MenuLink::create($request->validated());

        return redirect()
            ->route('admin.menu-links.index')
            ->with('success', 'menu_link_created_success');
    }

    public function edit(MenuLink $menuLink): Response
    {
        $this->authorize('update', $menuLink);

        return Inertia::render('Admin/MenuLinks/Edit', [
            'menuLink' => $menuLink->load('page:id,title,slug'),
            'pageOptions' => Page::orderBy('title')->get(['id', 'title', 'slug']),
            'parentOptions' => MenuLink::whereNull('parent_id')
                ->where('id', '!=', $menuLink->id)
                ->orderBy('location')
                ->orderBy('sort_order')
                ->get(['id', 'label', 'location']),
            'footerGroupOptions' => $this->footerGroupOptions(),
        ]);
    }

    /**
     * نام ستون‌های فوتری که همین الان توی دیتابیس استفاده شدن — برای اینکه
     * تو فرم به‌جای تایپ آزاد و مستعد اشتباه‌تایپی، از یه دراپ‌داون انتخاب
     * بشن (به‌علاوه‌ی گزینه‌ی «افزودن ستون جدید» که تو فرانت‌اند اضافه می‌شه).
     */
    private function footerGroupOptions()
    {
        return MenuLink::where('location', 'footer')
            ->whereNull('parent_id')
            ->get()
            ->groupBy(fn ($link) => $link->getTranslation('group_label', 'en'))
            ->map(fn ($links) => $links->first()->getTranslations('group_label'))
            ->values();
    }

    public function update(UpdateMenuLinkRequest $request, MenuLink $menuLink): RedirectResponse
    {
        $menuLink->update($request->validated());

        return redirect()
            ->route('admin.menu-links.index')
            ->with('success', 'menu_link_updated_success');
    }

    public function destroy(MenuLink $menuLink): RedirectResponse
    {
        $this->authorize('delete', $menuLink);

        $menuLink->delete();

        return back()->with('success', 'menu_link_deleted');
    }
}
