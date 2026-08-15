<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\StoreTeamMemberRequest;
use App\Http\Requests\Admin\UpdateTeamMemberRequest;
use App\Models\TeamMember;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TeamMemberController extends Controller
{
    public function index(): Response
    {
        $this->authorize('viewAny', TeamMember::class);

        return Inertia::render('Admin/TeamMembers/Index', [
            'teamMembers' => TeamMember::orderBy('sort_order')->get(),
        ]);
    }

    public function create(): Response
    {
        $this->authorize('create', TeamMember::class);

        return Inertia::render('Admin/TeamMembers/Create');
    }

    public function store(StoreTeamMemberRequest $request): RedirectResponse
    {
        TeamMember::create($request->validated());

        return redirect()
            ->route('admin.team-members.index')
            ->with('success', 'team_member_created_success');
    }

    public function edit(TeamMember $teamMember): Response
    {
        $this->authorize('update', $teamMember);

        return Inertia::render('Admin/TeamMembers/Edit', [
            'teamMember' => $teamMember,
        ]);
    }

    public function update(UpdateTeamMemberRequest $request, TeamMember $teamMember): RedirectResponse
    {
        $teamMember->update($request->validated());

        return redirect()
            ->route('admin.team-members.index')
            ->with('success', 'team_member_updated_success');
    }

    public function destroy(TeamMember $teamMember): RedirectResponse
    {
        $this->authorize('delete', $teamMember);

        $teamMember->delete();

        return redirect()
            ->route('admin.team-members.index')
            ->with('success', 'team_member_deleted');
    }
}
