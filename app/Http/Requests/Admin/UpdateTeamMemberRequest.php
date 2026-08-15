<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;

class UpdateTeamMemberRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('team_member'));
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'array'],
            'name.en' => ['required', 'string', 'max:255'],
            'name.fr' => ['nullable', 'string', 'max:255'],
            'name.fa' => ['nullable', 'string', 'max:255'],
            'role_title' => ['nullable', 'array'],
            'role_title.en' => ['nullable', 'string', 'max:255'],
            'role_title.fr' => ['nullable', 'string', 'max:255'],
            'role_title.fa' => ['nullable', 'string', 'max:255'],
            'bio' => ['nullable', 'array'],
            'bio.en' => ['nullable', 'string', 'max:1000'],
            'bio.fr' => ['nullable', 'string', 'max:1000'],
            'bio.fa' => ['nullable', 'string', 'max:1000'],
            'photo' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['boolean'],
        ];
    }
}
