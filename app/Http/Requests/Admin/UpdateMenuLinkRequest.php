<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateMenuLinkRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return $this->user()->can('update', \App\Models\MenuLink::class);
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
            'url' => ['required_without:page_id', 'nullable', 'string', 'max:255'],
            'page_id' => ['required_without:url', 'nullable', 'integer', 'exists:pages,id'],
            'parent_id' => [
                'nullable',
                'integer',
                Rule::notIn([$this->route('menu_link')->id]),
                Rule::exists('menu_links', 'id')->where('parent_id', null),
            ],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['boolean'],
            'group_label.fa' => ['nullable', 'string', 'max:255'],
            'label.fa' => ['nullable', 'string', 'max:255'],
        ];
    }
}
