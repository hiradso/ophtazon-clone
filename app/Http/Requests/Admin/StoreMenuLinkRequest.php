<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreMenuLinkRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', \App\Models\MenuLink::class);
    }

    public function rules(): array
    {
        return [
            'location' => ['required', 'in:header,footer'],
            'group_label' => ['nullable', 'array'],
            'group_label.en' => [
                Rule::requiredIf(fn() => $this->input('location') === 'footer'),
                'nullable',
                'string',
                'max:100',
            ],
            'group_label.fr' => ['nullable', 'string', 'max:100'],
            'label' => ['required', 'array'],
            'label.en' => ['required', 'string', 'max:100'],
            'label.fr' => ['nullable', 'string', 'max:100'],
            'url' => ['required', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['boolean'],
            'group_label.fa' => ['nullable', 'string', 'max:255'],
            'label.fa' => ['nullable', 'string', 'max:255'],
        ];
    }
}
