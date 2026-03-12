<?php

namespace Tests\Feature\Api;

use App\Models\Application;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CustomerApiTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['role' => 'admin']);
    }

    // Crea un cliente con il relativo record Customer
    private function cliente(): User
    {
        $user = User::factory()->create(['role' => 'cliente']);
        Customer::factory()->create(['user_id' => $user->id]);
        return $user;
    }

    // --- GET /api/customers ---

    public function test_get_customers_unauthenticated_returns_401(): void
    {
        $this->getJson('/api/customers')->assertUnauthorized();
    }

    public function test_admin_vede_tutti_i_clienti(): void
    {
        Customer::factory()->count(3)->create();

        Sanctum::actingAs($this->admin());

        $this->getJson('/api/customers')->assertOk()->assertJsonCount(3, 'data');
    }

    public function test_cliente_vede_solo_il_proprio_record(): void
    {
        Customer::factory()->count(2)->create(); // altri clienti
        $user = $this->cliente();

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/customers')->assertOk();
        $data = $response->json();
        $this->assertCount(1, $data);
        $this->assertEquals($user->id, $data[0]['user_id']);
    }

    // --- POST /api/customers ---

    public function test_post_customers_unauthenticated_returns_401(): void
    {
        $this->postJson('/api/customers', [])->assertUnauthorized();
    }

    public function test_cliente_non_puo_creare_cliente(): void
    {
        Sanctum::actingAs($this->cliente());

        $this->postJson('/api/customers', [
            'company_name' => 'Test Srl',
            'vat_number'   => '12345678901',
            'email'        => 'nuovo@test.it',
            'address'      => 'Address',
            'phone'        => '12345678901'
        ])->assertForbidden();
    }

    public function test_admin_crea_cliente_con_dati_validi(): void
    {
        Sanctum::actingAs($this->admin());

        $response = $this->postJson('/api/customers', [
            'company_name' => 'Nuova Srl',
            'vat_number'   => '12345678901',
            'email'        => 'nuova@srl.it',
            'address'      => 'Address',
            'phone'        => '12345678901'
        ])->assertCreated();

        $this->assertDatabaseHas('customers', ['vat_number' => '12345678901']);
        $this->assertDatabaseHas('users', ['email' => 'nuova@srl.it', 'role' => 'cliente']);
    }

    public function test_admin_crea_cliente_con_vat_number_duplicato_returns_422(): void
    {
        Customer::factory()->create(['vat_number' => '12345678901']);

        Sanctum::actingAs($this->admin());

        $this->postJson('/api/customers', [
            'company_name' => 'Altra Srl',
            'vat_number'   => '12345678901',
            'email'        => 'altra@srl.it',
        ])->assertUnprocessable();
    }

    public function test_admin_crea_cliente_con_email_duplicata_returns_422(): void
    {
        User::factory()->create(['email' => 'esiste@srl.it']);

        Sanctum::actingAs($this->admin());

        $this->postJson('/api/customers', [
            'company_name' => 'Nuova Srl',
            'vat_number'   => '98765432109',
            'email'        => 'esiste@srl.it',
        ])->assertUnprocessable();
    }

    // --- PUT /api/customers/{customer} ---

    public function test_put_customer_unauthenticated_returns_401(): void
    {
        $customer = Customer::factory()->create();

        $this->putJson("/api/customers/{$customer->id}", [])->assertUnauthorized();
    }

    public function test_cliente_non_puo_aggiornare_cliente(): void
    {
        $customer = Customer::factory()->create();

        Sanctum::actingAs($this->cliente());

        $this->putJson("/api/customers/{$customer->id}", [
            'company_name' => 'Modificata Srl',
        ])->assertForbidden();
    }

    public function test_admin_aggiorna_campo_cliente(): void
    {
        $customer = Customer::factory()->create();

        Sanctum::actingAs($this->admin());

        $this->putJson("/api/customers/{$customer->id}", [
            'company_name' => 'Aggiornata Srl',
        ])->assertOk();

        $this->assertDatabaseHas('customers', [
            'id'           => $customer->id,
            'company_name' => 'Aggiornata Srl',
        ]);
    }

    public function test_admin_aggiorna_vat_number_duplicato_returns_422(): void
    {
        $altro = Customer::factory()->create(['vat_number' => '11111111111']);
        $customer = Customer::factory()->create(['vat_number' => '22222222222']);

        Sanctum::actingAs($this->admin());

        $this->putJson("/api/customers/{$customer->id}", [
            'vat_number' => '11111111111',
        ])->assertUnprocessable();
    }

    // --- DELETE /api/customers/{customer} ---

    public function test_delete_customer_unauthenticated_returns_401(): void
    {
        $customer = Customer::factory()->create();

        $this->deleteJson("/api/customers/{$customer->id}")->assertUnauthorized();
    }

    public function test_cliente_non_puo_eliminare_cliente(): void
    {
        // Nessuna pratica: la policy viene raggiunta e restituisce 403
        $customer = Customer::factory()->create();

        Sanctum::actingAs($this->cliente());

        $this->deleteJson("/api/customers/{$customer->id}")->assertForbidden();
    }

    public function test_admin_elimina_cliente_senza_pratiche(): void
    {
        $customer = Customer::factory()->create();

        Sanctum::actingAs($this->admin());

        $this->deleteJson("/api/customers/{$customer->id}")->assertOk();

        $this->assertDatabaseMissing('customers', ['id' => $customer->id]);
    }

    public function test_admin_non_puo_eliminare_cliente_con_pratiche(): void
    {
        $customer = Customer::factory()->create();
        Application::factory()->create(['customer_id' => $customer->id]);

        Sanctum::actingAs($this->admin());

        $this->deleteJson("/api/customers/{$customer->id}")->assertUnprocessable();
    }
}
