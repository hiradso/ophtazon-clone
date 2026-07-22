<?php

namespace Database\Seeders;

use App\Models\Store;
use App\Models\User;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(
            ['email' => 'admin@ophtazon.test'],
            [
                'name' => 'Super Admin',
                'password' => 'hirad123456',
                'role' => 'admin',
                'is_active' => true,
            ]
        );

        $franceStore = Store::where('slug', 'ophtazon-france')->first();

        if ($franceStore) {
            User::updateOrCreate(
                ['email' => 'staff-france@ophtazon-clone.test'],
                [
                    'name' => 'France Staff',
                    'password' => 'change-this-password',
                    'role' => 'staff',
                    'store_id' => $franceStore->id,
                    'country_id' => $franceStore->country_id,
                    'is_active' => true,
                ]
            );
        }
    }
}
