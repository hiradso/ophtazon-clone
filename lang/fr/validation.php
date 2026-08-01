<?php

return [

    /*
    |--------------------------------------------------------------------------
    | پیام‌های اعتبارسنجی به زبان فرانسه
    |--------------------------------------------------------------------------
    |
    | فقط قوانین و فیلدهایی که در فرم‌های Contact seller و Notify me
    | (Alert) استفاده می‌شوند، اینجا ترجمه شده‌اند. اگر بعداً فرم‌های
    | دیگری هم نیاز به ترجمه داشتند، باید کلیدهای مشابه اضافه شوند.
    |
    */

    'required' => 'Le champ :attribute est obligatoire.',
    'email' => "Le champ :attribute doit être une adresse e-mail valide.",
    'string' => 'Le champ :attribute doit être une chaîne de caractères.',
    'max' => [
        'string' => 'Le champ :attribute ne doit pas dépasser :max caractères.',
    ],
    'numeric' => 'Le champ :attribute doit être un nombre.',
    'integer' => 'Le champ :attribute doit être un entier.',
    'exists' => "La valeur sélectionnée pour :attribute n'est pas valide.",

    'attributes' => [
        'name' => 'nom',
        'email' => 'e-mail',
        'phone' => 'téléphone',
        'message' => 'message',
        'type' => 'type',
        'product_id' => 'produit',
        'store_id' => 'magasin',
        'category_id' => 'catégorie',
        'brand_id' => 'marque',
        'max_price' => 'prix maximum',
    ],

];
