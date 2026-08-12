<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('page'));
    }

    public function rules(): array
    {
        return [
            'parent_id' => [
                'nullable',
                'integer',
                'exists:pages,id',
                Rule::notIn([$this->route('page')->id]),
            ],
            'title' => ['required', 'array'],
            'title.en' => ['required', 'string', 'max:255'],
            'title.fr' => ['nullable', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'alpha_dash', Rule::unique('pages', 'slug')->ignore($this->route('page')->id)],
            'content' => ['nullable', 'array'],
            'content.en' => ['nullable', 'string'],
            'content.fr' => ['nullable', 'string'],
            'featured_image' => ['nullable', 'string', 'max:255'],
            'image_display_style' => ['required', 'in:banner,background'],
            'meta_description' => ['nullable', 'array'],
            'meta_description.en' => ['nullable', 'string', 'max:255'],
            'meta_description.fr' => ['nullable', 'string', 'max:255'],
            'is_published' => ['boolean'],
            'title.fa' => ['nullable', 'string', 'max:255'],
            'content.fa' => ['nullable', 'string'],
            'meta_description.fa' => ['nullable', 'string', 'max:255'],
        ];
    }
}
