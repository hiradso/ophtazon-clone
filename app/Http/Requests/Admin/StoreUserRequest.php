<?php

namespace App\Http\Requests\Admin;

use App\Models\User;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

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
            'password' => ['required', Password::defaults()],
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
