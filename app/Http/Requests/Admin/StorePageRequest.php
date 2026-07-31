<?php

namespace App\Http\Requests\Admin;

use App\Models\Page;
use Illuminate\Foundation\Http\FormRequest;

class StorePageRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Page::class);
    }

    public function rules(): array
    {
        return [
            'title' => ['required', 'array'],
            'title.en' => ['required', 'string', 'max:255'],
            'title.fr' => ['nullable', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:pages,slug', 'alpha_dash'],
            'content' => ['nullable', 'array'],
            'content.en' => ['nullable', 'string'],
            'content.fr' => ['nullable', 'string'],
            'featured_image' => ['nullable', 'string', 'max:255'],
            'image_display_style' => ['required', 'in:banner,background'],
            'meta_description' => ['nullable', 'array'],
            'meta_description.en' => ['nullable', 'string', 'max:255'],
            'meta_description.fr' => ['nullable', 'string', 'max:255'],
            'is_published' => ['boolean'],
        ];
    }
}
