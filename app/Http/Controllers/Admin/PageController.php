<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StorePageRequest;
use App\Http\Requests\Admin\UpdatePageRequest;
use App\Models\Page;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Storage;

class PageController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', Page::class);

        return Inertia::render('Admin/Pages/Index', [
            'pages' => Page::orderBy('title')->get(),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Page::class);

        return Inertia::render('Admin/Pages/Create');
    }

    public function store(StorePageRequest $request): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('featured_image')) {
            $data['featured_image'] = $request->file('featured_image')->store('pages', 'public');
        }

        Page::create($data);

        return redirect()
            ->route('admin.pages.index')
            ->with('success', 'Page created successfully.');
    }

    public function edit(Page $page): Response
    {
        $this->authorize('update', $page);

        return Inertia::render('Admin/Pages/Edit', [
            'page' => $page,
        ]);
    }

    public function update(UpdatePageRequest $request, Page $page): RedirectResponse
    {
        $data = $request->validated();

        if ($request->hasFile('featured_image')) {
            if ($page->featured_image) {
                Storage::disk('public')->delete($page->featured_image);
            }
            $data['featured_image'] = $request->file('featured_image')->store('pages', 'public');
        } else {
            unset($data['featured_image']);
        }

        $page->update($data);

        return redirect()
            ->route('admin.pages.index')
            ->with('success', 'Page updated successfully.');
    }

    public function destroy(Page $page): RedirectResponse
    {
        $this->authorize('delete', $page);

        $page->delete();

        return redirect()
            ->route('admin.pages.index')
            ->with('success', 'Page deleted.');
    }
}
