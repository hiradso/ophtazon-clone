<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateSettingRequest;
use App\Models\Setting;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Storage;
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
        $setting = Setting::current();
        $data = $request->validated();

        if ($request->hasFile('logo')) {
            if ($setting->logo) {
                Storage::disk('public')->delete($setting->logo);
            }
            $data['logo'] = $request->file('logo')->store('settings', 'public');
        } else {
            unset($data['logo']);
        }

        $setting->update($data);

        return redirect()
            ->route('admin.settings.edit')
            ->with('success', 'Settings updated successfully.');
    }
}
