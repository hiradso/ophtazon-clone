<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    public function run(): void
    {
        $categories = [
            ['slug' => 'slit-lamp', 'en' => 'Slit Lamp', 'fr' => 'Lampe à fente'],
            ['slug' => 'oct', 'en' => 'OCT', 'fr' => 'OCT'],
            ['slug' => 'autorefractor', 'en' => 'Autorefractor', 'fr' => 'Autoréfractomètre'],
            ['slug' => 'tonometer', 'en' => 'Tonometer', 'fr' => 'Tonomètre'],
            ['slug' => 'phoropter', 'en' => 'Phoropter', 'fr' => 'Réfracteur'],
            ['slug' => 'operating-microscope', 'en' => 'Operating Microscope', 'fr' => 'Microscope opératoire'],
            ['slug' => 'fundus-camera', 'en' => 'Fundus Camera', 'fr' => 'Rétinographe'],
            ['slug' => 'perimeter', 'en' => 'Perimeter', 'fr' => 'Périmètre'],
            ['slug' => 'ultrasound', 'en' => 'Ultrasound (A/B Scan)', 'fr' => 'Échographe (A/B Scan)'],
            ['slug' => 'lensmeter', 'en' => 'Lensmeter', 'fr' => 'Frontofocomètre'],
        ];

        foreach ($categories as $index => $category) {
            Category::updateOrCreate(
                ['slug' => $category['slug']],
                [
                    'name' => ['en' => $category['en'], 'fr' => $category['fr']],
                    'sort_order' => $index,
                ]
            );
        }
    }
}
