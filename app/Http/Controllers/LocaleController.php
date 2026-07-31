<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

class LocaleController extends Controller
{
    public function update(Request $request, string $locale): RedirectResponse
    {
        if (in_array($locale, ['en', 'fr'], true)) {
            $request->session()->put('locale', $locale);
        }

        return back();
    }
}
