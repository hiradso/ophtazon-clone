<?php

namespace App\Http\Requests\Admin;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class UpdateUserRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('user'));
    }

    public function rules(): array
    {
        return [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($this->route('user')->id)],
            'password' => ['nullable', Password::defaults()],
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
