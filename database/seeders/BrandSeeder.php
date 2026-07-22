<?php

namespace Database\Seeders;

use App\Models\Brand;
use Illuminate\Database\Seeder;

class BrandSeeder extends Seeder
{
    public function run(): void
    {
        $brands = [
            'Topcon',
            'Zeiss',
            'Nidek',
            'Haag-Streit',
            'Canon',
            'Heidelberg Engineering',
            'Optos',
            'Reichert',
            'CSO',
            'Essilor',
        ];

        foreach ($brands as $brand) {
            Brand::updateOrCreate(['name' => $brand]);
        }
    }
}
