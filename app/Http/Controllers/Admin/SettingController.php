<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSettingRequest;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class SettingController extends Controller
{
    public function edit(): Response
    {
        $this->authorize('view', Setting::class);

        return Inertia::render('Admin/Settings/Edit', [
            'settings' => Setting::current(),
        ]);
    }

    public function update(UpdateSettingRequest $request): RedirectResponse
    {
        Setting::current()->update($request->validated());

        return redirect()
            ->route('admin.settings.edit')
            ->with('success', 'Settings updated successfully.');
    }
}
