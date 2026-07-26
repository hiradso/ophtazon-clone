<?php

namespace App\Http\Controllers\Admin;

use App\Enums\UserRole;
use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\UpdateContactRequestRequest;
use App\Models\ContactRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class ContactRequestController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', ContactRequest::class);

        $contactRequests = ContactRequest::query()
            ->with(['product:id,title,slug', 'store:id,name', 'handler:id,name'])
            ->when(Auth::user()->role === UserRole::Staff, function ($query) {
                $query->where('store_id', Auth::user()->store_id);
            })
            ->latest()
            ->paginate(20);

        return Inertia::render('Admin/ContactRequests/Index', [
            'contactRequests' => $contactRequests,
        ]);
    }

    public function update(UpdateContactRequestRequest $request, ContactRequest $contactRequest): RedirectResponse
    {
        $contactRequest->update([
            ...$request->validated(),
            'handled_by' => Auth::id(),
            'replied_at' => $request->filled('reply_message') ? now() : $contactRequest->replied_at,
        ]);

        return back()->with('success', 'Request updated.');
    }
}
