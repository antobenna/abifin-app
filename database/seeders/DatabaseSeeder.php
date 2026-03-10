<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Customer;
use App\Models\Application;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Creo uno User con ruolo Admin
        User::factory()->create([
            'name' => 'admin',
            'email' => 'admin@abifin.it',
            'role' => 'admin',
        ]);

        // 2. Creo 10 Clienti, ognuno con 3 Pratiche associate
        Customer::factory(10)
            ->has(Application::factory()->count(3))
            ->create();
    }
}
