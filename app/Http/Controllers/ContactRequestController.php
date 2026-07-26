<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreContactRequestRequest;
use App\Models\ContactRequest;
use Illuminate\Http\RedirectResponse;

class ContactRequestController extends Controller
{
    public function store(StoreContactRequestRequest $request): RedirectResponse
    {
        ContactRequest::create([
            ...$request->validated(),
            'status' => 'new',
            'locale' => app()->getLocale(),
            'source_url' => $request->headers->get('referer'),
            'ip_address' => $request->ip(),
        ]);

        return back()->with('success', 'Your message has been sent. We will contact you soon.');
    }
}
