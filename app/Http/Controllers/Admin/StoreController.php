<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreStoreRequest;
use App\Http\Requests\Admin\UpdateStoreRequest;
use App\Models\Country;
use App\Models\Store;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class StoreController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', Store::class);

        return Inertia::render('Admin/Stores/Index', [
            'stores' => Store::with('country')->withCount('products')->orderBy('name')->get(),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Store::class);

        return Inertia::render('Admin/Stores/Create', [
            'countries' => Country::where('is_active', true)->get(['id', 'name']),
        ]);
    }

    public function store(StoreStoreRequest $request): RedirectResponse
    {
        Store::create($request->validated());

        return redirect()
            ->route('admin.stores.index')
            ->with('success', 'Store created successfully.');
    }

    public function edit(Store $store): Response
    {
        $this->authorize('update', $store);

        return Inertia::render('Admin/Stores/Edit', [
            'store' => $store,
            'countries' => Country::where('is_active', true)->get(['id', 'name']),
        ]);
    }

    public function update(UpdateStoreRequest $request, Store $store): RedirectResponse
    {
        $store->update($request->validated());

        return redirect()
            ->route('admin.stores.index')
            ->with('success', 'Store updated successfully.');
    }

    public function destroy(Store $store): RedirectResponse
    {
        $this->authorize('delete', $store);

        if ($store->products()->exists() || $store->staff()->exists()) {
            return back()->with('error', 'Cannot delete a store that has products or staff members.');
        }

        $store->delete();

        return redirect()
            ->route('admin.stores.index')
            ->with('success', 'Store deleted.');
    }
}
