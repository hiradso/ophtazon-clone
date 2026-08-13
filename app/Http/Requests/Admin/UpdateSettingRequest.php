<?php

namespace App\Http\Requests\Admin;

use App\Models\Setting;
use Illuminate\Foundation\Http\FormRequest;

class UpdateSettingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return $this->user()->can('update', Setting::class);
    }

    public function rules(): array
    {
        return [
            'site_name' => ['required', 'string', 'max:255'],
            'logo' => ['nullable', 'string', 'max:255'],
            'contact_email' => ['nullable', 'email', 'max:255'],
            'contact_phone' => ['nullable', 'string', 'max:255'],
            'robots_txt' => ['nullable', 'string', 'max:2000'],
            'font_latin' => ['required', 'in:Geist,Inter,Roboto,Poppins,Nunito Sans,Playfair Display'],
            'font_persian' => ['required', 'in:Vazirmatn,Noto Sans Arabic,Rubik,Noto Naskh Arabic'],
            'slogan' => ['nullable', 'array'],
            'slogan.en' => ['nullable', 'string', 'max:255'],
            'slogan.fr' => ['nullable', 'string', 'max:255'],
            'slogan.fa' => ['nullable', 'string', 'max:255'],
        ];
    }
}
