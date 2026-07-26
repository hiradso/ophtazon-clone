<?php

namespace App\Http\Requests\Admin;

use App\Enums\ContactRequestStatus;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdateContactRequestRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', $this->route('contact_request'));
    }

    public function rules(): array
    {
        return [
            'status' => ['required', Rule::enum(ContactRequestStatus::class)],
            'reply_message' => ['nullable', 'string', 'max:2000'],
        ];
    }
}
