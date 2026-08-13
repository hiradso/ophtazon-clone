<?php

namespace App\Http\Requests\Admin;

use App\Models\User;
use App\Rules\StrongPassword;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('create', User::class);
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', new StrongPassword],
            'role' => ['required', 'in:admin,staff,customer'],
            'store_id' => [
                Rule::requiredIf($this->input('role') === 'staff'),
                'nullable',
                'integer',
                'exists:stores,id',
            ],
            'country_id' => ['nullable', 'integer', 'exists:countries,id'],
            'is_active' => ['boolean'],
        ];
    }
}
