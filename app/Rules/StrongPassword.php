<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Translation\PotentiallyTranslatedString;

class StrongPassword implements ValidationRule
{
    /**
     * همان منطق امتیازدهی که در PasswordStrengthMeter.jsx سمت کاربر
     * استفاده می‌شود — رمز عبور باید حداقل «متوسط» باشد (۳ از ۵ معیار).
     * این تضمین می‌کند قانون سمت کلاینت فقط یک راهنمای بصری نیست و
     * واقعاً روی سرور هم اجرا می‌شود.
     *
     * @param  Closure(string, ?string=): PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $password = (string) $value;

        $checks = [
            mb_strlen($password) >= 8,
            (bool) preg_match('/[a-z]/', $password),
            (bool) preg_match('/[A-Z]/', $password),
            (bool) preg_match('/[0-9]/', $password),
            (bool) preg_match('/[^a-zA-Z0-9]/', $password),
        ];

        $score = count(array_filter($checks));

        if ($score < 3) {
            $fail(match (app()->getLocale()) {
                'fr' => 'Le mot de passe est trop faible. Utilisez au moins 8 caractères avec un mélange de majuscules, minuscules, chiffres et symboles.',
                'fa' => 'رمز عبور خیلی ضعیف است. حداقل ۸ کاراکتر با ترکیبی از حروف بزرگ، کوچک، عدد و نماد استفاده کنید.',
                default => 'This password is too weak. Use at least 8 characters with a mix of uppercase, lowercase, numbers, and symbols.',
            });
        }
    }
}
