<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateBrandRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('brand'));
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255', Rule::unique('brands', 'name')->ignore($this->route('brand')->id)],
            'logo_url' => ['nullable', 'string', 'max:255'],
            'is_active' => ['boolean'],
        ];
    }
}
