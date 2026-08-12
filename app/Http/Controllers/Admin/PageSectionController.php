<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\PageSection;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class PageSectionController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', PageSection::class);

        return Inertia::render('Admin/PageSections/Index', [
            'sections' => PageSection::orderBy('sort_order')->get(),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', PageSection::class);

        return Inertia::render('Admin/PageSections/Create');
    }

    public function store(Request $request): RedirectResponse
    {
        $this->authorize('create', PageSection::class);

        $request->validate([
            'type' => ['required', 'in:hero,categories,latest_products,discounted_products,custom_content'],
            'content' => ['nullable', 'array'],
            'is_active' => ['boolean'],
        ]);

        $maxOrder = PageSection::max('sort_order') ?? 0;

        PageSection::create([
            ...$request->only(['type', 'content', 'is_active']),
            'sort_order' => $maxOrder + 1,
        ]);

        return redirect()->route('admin.page-sections.index')->with('success', 'section_created');
    }

    public function edit(PageSection $pageSection): Response
    {
        $this->authorize('update', $pageSection);

        return Inertia::render('Admin/PageSections/Edit', [
            'section' => $pageSection,
        ]);
    }

    public function update(Request $request, PageSection $pageSection): RedirectResponse
    {
        $this->authorize('update', $pageSection);

        $request->validate([
            'content' => ['nullable', 'array'],
            'is_active' => ['boolean'],
        ]);

        $pageSection->update($request->only(['content', 'is_active']));

        return redirect()->route('admin.page-sections.index')->with('success', 'section_updated');
    }
    public function reorder(Request $request): RedirectResponse
    {
        $this->authorize('update', PageSection::class);

        $request->validate([
            'order' => ['required', 'array'],
            'order.*' => ['integer', 'exists:page_sections,id'],
        ]);

        foreach ($request->input('order') as $index => $id) {
            PageSection::where('id', $id)->update(['sort_order' => $index]);
        }

        return back();
    }

    public function destroy(PageSection $pageSection): RedirectResponse
    {
        $this->authorize('delete', $pageSection);

        $pageSection->delete();

        return back()->with('success', 'section_deleted');
    }

    public function move(Request $request, PageSection $pageSection): RedirectResponse
    {
        $this->authorize('update', $pageSection);

        $request->validate(['direction' => ['required', 'in:up,down']]);

        $sections = PageSection::orderBy('sort_order')->get();
        $currentIndex = $sections->search(fn($s) => $s->id === $pageSection->id);
        $swapIndex = $request->input('direction') === 'up' ? $currentIndex - 1 : $currentIndex + 1;

        if ($swapIndex < 0 || $swapIndex >= $sections->count()) {
            return back();
        }

        $current = $sections[$currentIndex];
        $swap = $sections[$swapIndex];

        [$current->sort_order, $swap->sort_order] = [$swap->sort_order, $current->sort_order];
        $current->save();
        $swap->save();

        return back();
    }
}
