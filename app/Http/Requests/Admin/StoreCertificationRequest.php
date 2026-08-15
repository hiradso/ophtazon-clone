<?php

namespace App\Http\Requests\Admin;

use App\Models\Certification;
use Illuminate\Foundation\Http\FormRequest;

class StoreCertificationRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', Certification::class);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'array'],
            'name.en' => ['required', 'string', 'max:255'],
            'name.fr' => ['nullable', 'string', 'max:255'],
            'name.fa' => ['nullable', 'string', 'max:255'],
            'issuing_body' => ['nullable', 'array'],
            'issuing_body.en' => ['nullable', 'string', 'max:255'],
            'issuing_body.fr' => ['nullable', 'string', 'max:255'],
            'issuing_body.fa' => ['nullable', 'string', 'max:255'],
            'description' => ['nullable', 'array'],
            'description.en' => ['nullable', 'string', 'max:1000'],
            'description.fr' => ['nullable', 'string', 'max:1000'],
            'description.fa' => ['nullable', 'string', 'max:1000'],
            'image' => ['nullable', 'string', 'max:255'],
            'sort_order' => ['nullable', 'integer'],
            'is_active' => ['boolean'],
        ];
    }
}
