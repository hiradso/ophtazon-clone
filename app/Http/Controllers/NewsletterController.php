<?php

namespace App\Http\Controllers;

use App\Models\NewsletterSubscriber;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class NewsletterController extends Controller
{
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'email' => ['required', 'email', 'max:255'],
        ]);

        NewsletterSubscriber::updateOrCreate(
            ['email' => $request->input('email')],
            [
                'locale' => app()->getLocale(),
                'source' => $request->input('source', 'footer'),
                'unsubscribe_token' => Str::random(40),
                'is_subscribed' => true,
                'unsubscribed_at' => null,
            ]
        );

        return back()->with('success', 'newsletter_subscribed');
    }
}
