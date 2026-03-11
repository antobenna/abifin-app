<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Customer;
use App\Models\Application;
use Illuminate\Support\Facades\Hash;
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
            'password' => Hash::make('admin'),
        ]);

        $company_name = 'Rossi SRL';

        // 2. Creo uno User con ruolo cliente
        $testCustomerUser = User::factory()->create([
            'name' => $company_name,
            'email' => 'cliente@test.it',
            'role' => 'cliente',
            'password' => Hash::make('cliente123'),
        ]);

        // 3. Creo l'anagrafica cliente collegata all'utente, con 3 Pratiche associate
        Customer::factory()->has(Application::factory()->count(3))->create([
            'user_id' => $testCustomerUser->id,
            'company_name' => $company_name,
            'vat_number' => 'IT123456789',
        ]);

        // 4. Creo 10 Clienti, ognuno con 3 Pratiche associate
        Customer::factory(10)
            ->has(Application::factory()->count(3))
            ->create();
    }
}
