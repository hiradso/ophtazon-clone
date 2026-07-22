<?php

namespace Database\Seeders;

use App\Models\Country;
use App\Models\Store;
use Illuminate\Database\Seeder;

class StoreSeeder extends Seeder
{
    public function run(): void
    {
        $stores = [
            [
                'country_iso' => 'FR',
                'name' => 'Ophtazon France',
                'slug' => 'ophtazon-france',
                'phone' => '+33 1 23 45 67 89',
                'email' => 'contact@ophtazon.fr',
            ],
            [
                'country_iso' => 'CI',
                'name' => 'Ophtazon Ivory Coast',
                'slug' => 'ophtazon-ivory-coast',
                'phone' => '+225 07 00 00 00',
                'email' => 'contact@ophtazon.ci',
            ],
            [
                'country_iso' => 'SN',
                'name' => 'Ophtazon Senegal',
                'slug' => 'ophtazon-senegal',
                'phone' => '+221 77 000 00 00',
                'email' => 'contact@ophtazon.sn',
            ],
            [
                'country_iso' => 'CM',
                'name' => 'Ophtazon Cameroon',
                'slug' => 'ophtazon-cameroon',
                'phone' => '+237 6 00 00 00 00',
                'email' => 'contact@ophtazon.cm',
            ],
            [
                'country_iso' => 'TG',
                'name' => 'Ophtazon Togo',
                'slug' => 'ophtazon-togo',
                'phone' => '+228 90 00 00 00',
                'email' => 'contact@ophtazon.tg',
            ],
        ];

        foreach ($stores as $store) {
            $country = Country::where('iso_code', $store['country_iso'])->firstOrFail();

            Store::updateOrCreate(
                ['slug' => $store['slug']],
                [
                    'country_id' => $country->id,
                    'name' => $store['name'],
                    'phone' => $store['phone'],
                    'email' => $store['email'],
                ]
            );
        }
    }
}
