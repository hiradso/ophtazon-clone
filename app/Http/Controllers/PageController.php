<?php

namespace App\Http\Controllers;

use App\Models\Page;
use Inertia\Inertia;
use Inertia\Response;

class PageController extends Controller
{
    public function show(Page $page): Response
    {
        abort_unless($page->is_published, 404);

        return Inertia::render('Pages/Show', [
            'page' => $page,
        ]);
    }
}
