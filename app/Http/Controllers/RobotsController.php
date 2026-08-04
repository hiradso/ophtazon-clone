<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Response;

class RobotsController extends Controller
{
    public function index(): Response
    {
        $settings = Setting::current();

        $content = $settings->robots_txt ?: $this->defaultContent();

        return response($content, 200)->header('Content-Type', 'text/plain');
    }

    private function defaultContent(): string
    {
        return implode("\n", [
            'User-agent: *',
            'Disallow: /admin',
            'Disallow: /checkout',
            'Disallow: /cart',
            'Disallow: /profile',
            'Disallow: /my-orders',
            '',
            'Sitemap: ' . route('sitemap'),
        ]);
    }
}
