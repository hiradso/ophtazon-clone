<?php

return [

    /*
    |--------------------------------------------------------------------------
    | پیام‌های اعتبارسنجی به زبان فرانسه
    |--------------------------------------------------------------------------
    |
    | اولیه فقط برای فرم‌های Contact seller و Notify me (Alert) نوشته شده
    | بود؛ بعداً attributes برای فرم‌های آدرس/چک‌اوت هم اضافه شد چون همون
    | باگ raw attribute name (مثل country_id) اونجا هم اتفاق می‌افتاد. اگر
    | فرم عمومی جدیدی اضافه شد که به فرانسه هم نمایش داده می‌شه، کلید
    | attribute مربوطه رو اینجا هم اضافه کن.
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

        // آدرس / چک‌اوت
        'full_name' => 'nom complet',
        'country_id' => 'pays',
        'city' => 'ville',
        'address' => 'adresse',
        'address_line' => 'adresse',
        'postal_code' => 'code postal',
        'payment_method' => 'mode de paiement',
        'is_default' => 'adresse par défaut',
        'quantity' => 'quantité',
    ],

];
