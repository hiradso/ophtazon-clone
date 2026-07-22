<?php

namespace Database\Seeders;

use App\Models\Country;
use Illuminate\Database\Seeder;

class CountrySeeder extends Seeder
{
    public function run(): void
    {
        $countries = [
            [
                'name' => 'France',
                'iso_code' => 'FR',
                'currency_code' => 'EUR',
                'phone_prefix' => '+33',
            ],
            [
                'name' => 'Ivory Coast',
                'iso_code' => 'CI',
                'currency_code' => 'XOF',
                'phone_prefix' => '+225',
            ],
            [
                'name' => 'Senegal',
                'iso_code' => 'SN',
                'currency_code' => 'XOF',
                'phone_prefix' => '+221',
            ],
            [
                'name' => 'Cameroon',
                'iso_code' => 'CM',
                'currency_code' => 'XAF',
                'phone_prefix' => '+237',
            ],
            [
                'name' => 'Togo',
                'iso_code' => 'TG',
                'currency_code' => 'XOF',
                'phone_prefix' => '+228',
            ],
        ];

        foreach ($countries as $country) {
            Country::updateOrCreate(
                ['iso_code' => $country['iso_code']],
                $country
            );
        }
    }
}
