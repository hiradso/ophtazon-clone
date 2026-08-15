<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreCertificationRequest;
use App\Http\Requests\Admin\UpdateCertificationRequest;
use App\Models\Certification;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class CertificationController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', Certification::class);

        return Inertia::render('Admin/Certifications/Index', [
            'certifications' => Certification::orderBy('sort_order')->get(),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', Certification::class);

        return Inertia::render('Admin/Certifications/Create');
    }

    public function store(StoreCertificationRequest $request): RedirectResponse
    {
        Certification::create($request->validated());

        return redirect()
            ->route('admin.certifications.index')
            ->with('success', 'certification_created_success');
    }

    public function edit(Certification $certification): Response
    {
        $this->authorize('update', $certification);

        return Inertia::render('Admin/Certifications/Edit', [
            'certification' => $certification,
        ]);
    }

    public function update(UpdateCertificationRequest $request, Certification $certification): RedirectResponse
    {
        $certification->update($request->validated());

        return redirect()
            ->route('admin.certifications.index')
            ->with('success', 'certification_updated_success');
    }

    public function destroy(Certification $certification): RedirectResponse
    {
        $this->authorize('delete', $certification);

        $certification->delete();

        return redirect()
            ->route('admin.certifications.index')
            ->with('success', 'certification_deleted');
    }
}
