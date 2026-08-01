<?php

namespace App\Http\Requests\Admin;

use App\Enums\ProductCondition;
use App\Enums\ProductStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateProductRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('product'));
    }

    public function rules(): array
    {
        $productId = $this->route('product')->id;

        return [
            'reference' => ['required', 'string', 'max:255', Rule::unique('products', 'reference')->ignore($productId)],
            'title' => ['required', 'array'],
            'title.en' => ['required', 'string', 'max:255'],
            'title.fr' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'array'],
            'description.en' => ['nullable', 'string'],
            'description.fr' => ['nullable', 'string'],
            'slug' => ['required', 'string', 'max:255', Rule::unique('products', 'slug')->ignore($productId)],
            'category_id' => ['required', 'integer', 'exists:categories,id'],
            'brand_id' => ['nullable', 'integer', 'exists:brands,id'],
            'store_id' => ['required', 'integer', 'exists:stores,id'],
            'condition' => ['required', Rule::enum(ProductCondition::class)],
            'status' => ['required', Rule::enum(ProductStatus::class)],
            'price' => ['required', 'numeric', 'min:0'],
            'currency' => ['required', 'string', 'size:3'],
            'manufacture_year' => ['nullable', 'integer', 'min:1980', 'max:' . (date('Y') + 1)],
            'warranty_months' => ['nullable', 'integer', 'min:0'],
            'is_checked' => ['boolean'],
            'attributes' => ['nullable', 'array'],
            'stock_quantity' => ['required', 'integer', 'min:1'],
        ];
    }
}
