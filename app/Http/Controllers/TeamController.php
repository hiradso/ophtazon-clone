<?php

namespace App\Http\Controllers;

use App\Models\TeamMember;
use Inertia\Inertia;
use Inertia\Response;

class TeamController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Team/Index', [
            'teamMembers' => TeamMember::where('is_active', true)
                ->orderBy('sort_order')
                ->get(['id', 'name', 'role_title', 'bio', 'photo']),
        ]);
    }
}
