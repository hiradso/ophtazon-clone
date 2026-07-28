<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreMenuLinkRequest;
use App\Http\Requests\Admin\UpdateMenuLinkRequest;
use App\Models\MenuLink;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class MenuLinkController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', MenuLink::class);

        return Inertia::render('Admin/MenuLinks/Index', [
            'menuLinks' => MenuLink::orderBy('location')->orderBy('sort_order')->get(),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', MenuLink::class);

        return Inertia::render('Admin/MenuLinks/Create');
    }

    public function store(StoreMenuLinkRequest $request): RedirectResponse
    {
        MenuLink::create($request->validated());

        return redirect()
            ->route('admin.menu-links.index')
            ->with('success', 'Menu link created successfully.');
    }

    public function edit(MenuLink $menuLink): Response
    {
        $this->authorize('update', $menuLink);

        return Inertia::render('Admin/MenuLinks/Edit', [
            'menuLink' => $menuLink,
        ]);
    }

    public function update(UpdateMenuLinkRequest $request, MenuLink $menuLink): RedirectResponse
    {
        $menuLink->update($request->validated());

        return redirect()
            ->route('admin.menu-links.index')
            ->with('success', 'Menu link updated successfully.');
    }

    public function destroy(MenuLink $menuLink): RedirectResponse
    {
        $this->authorize('delete', $menuLink);

        $menuLink->delete();

        return back()->with('success', 'Menu link deleted.');
    }
}
