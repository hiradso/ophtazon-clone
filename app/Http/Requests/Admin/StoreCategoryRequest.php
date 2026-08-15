<?php

namespace App\Http\Requests\Admin;

use App\Models\Category;
use Illuminate\Foundation\Http\FormRequest;

class StoreCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Category::class);
    }

    public function rules(): array
    {
        return [
            'parent_id' => [
                'nullable',
                'integer',
                'exists:categories,id',
                function ($attribute, $value, $fail) {
                    if (! $value) {
                        return;
                    }

                    $parent = Category::find($value);

                    // حداکثر ۳ سطح مجاز: دسته (۰) → زیردسته (۱) → نوع دستگاه (۲)
                    if ($parent && $parent->depth() >= 2) {
                        $fail('Categories can only be nested up to 3 levels deep.');
                    }
                },
            ],
            'name' => ['required', 'array'],
            'name.en' => ['required', 'string', 'max:255'],
            'name.fr' => ['nullable', 'string', 'max:255'],
            'slug' => ['required', 'string', 'max:255', 'unique:categories,slug'],
            'icon_url' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['boolean'],
        ];
    }
}
