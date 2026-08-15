<?php

namespace App\Http\Requests\Admin;

use App\Models\Category;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateCategoryRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('category'));
    }

    public function rules(): array
    {
        $category = $this->route('category');
        $categoryId = $category->id;

        return [
            'parent_id' => [
                'nullable',
                'integer',
                'exists:categories,id',
                Rule::notIn([$categoryId]),
                function ($attribute, $value, $fail) use ($category) {
                    if (! $value) {
                        return;
                    }

                    // جلوگیری از چرخه: نمی‌شه یکی از فرزندان/نوه‌های خودِ
                    // دسته رو به‌عنوان والد جدیدش انتخاب کرد.
                    if (in_array((int) $value, $category->descendantIds(), true)) {
                        $fail('A category cannot be nested under itself or one of its own subcategories.');

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
            'slug' => ['required', 'string', 'max:255', Rule::unique('categories', 'slug')->ignore($categoryId)],
            'icon_url' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['boolean'],
        ];
    }
}
