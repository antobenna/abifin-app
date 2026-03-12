<?php

namespace Tests\Feature;

use App\Models\Application;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class CustomerTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['role' => 'admin']);
    }

    // Crea utente cliente con relativo record Customer
    private function cliente(): User
    {
        $user = User::factory()->create(['role' => 'cliente']);
        Customer::factory()->create(['user_id' => $user->id]);
        return $user;
    }

    private function validStorePayload(array $overrides = []): array
    {
        return array_merge([
            'company_name' => 'Test Srl',
            'address'      => 'Via Roma 1',
            'vat_number'   => '12345678901',
            'phone'        => '0612345678',
            'email'        => 'test@srl.it',
        ], $overrides);
    }

    // --- GET /customers ---

    public function test_get_customers_unauthenticated_redirects_to_login(): void
    {
        $this->get('/customers')->assertRedirect(route('login'));
    }

    public function test_admin_vede_tutti_i_clienti(): void
    {
        Customer::factory()->count(3)->create();

        $this->actingAs($this->admin())
            ->get('/customers')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Customers/Index')
                ->has('customers.data')
            );
    }

    public function test_cliente_vede_solo_il_proprio_record(): void
    {
        Customer::factory()->count(2)->create();
        $user = $this->cliente();

        $this->actingAs($user)
            ->get('/customers')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('customers', 1)
            );
    }

    // --- GET /customers/create ---

    public function test_get_customers_create_unauthenticated_redirects_to_login(): void
    {
        $this->get('/customers/create')->assertRedirect(route('login'));
    }

    public function test_cliente_non_puo_accedere_al_form_di_creazione(): void
    {
        $this->actingAs($this->cliente())
            ->get('/customers/create')
            ->assertForbidden();
    }

    public function test_admin_visualizza_form_di_creazione(): void
    {
        $this->actingAs($this->admin())
            ->get('/customers/create')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Customers/Create')
            );
    }

    // --- POST /customers ---

    public function test_post_customers_unauthenticated_redirects_to_login(): void
    {
        $this->post('/customers', [])->assertRedirect(route('login'));
    }

    public function test_cliente_non_puo_creare_cliente(): void
    {
        $this->actingAs($this->cliente())
            ->post('/customers', $this->validStorePayload())
            ->assertForbidden();
    }

    public function test_admin_crea_cliente_con_dati_validi(): void
    {
        $this->actingAs($this->admin())
            ->post('/customers', $this->validStorePayload())
            ->assertRedirect(route('customers.index'));

        $this->assertDatabaseHas('customers', ['vat_number' => '12345678901']);
        $this->assertDatabaseHas('users', ['email' => 'test@srl.it', 'role' => 'cliente']);
    }

    public function test_admin_crea_cliente_con_vat_number_duplicato_fallisce(): void
    {
        Customer::factory()->create(['vat_number' => '12345678901']);

        $this->actingAs($this->admin())
            ->post('/customers', $this->validStorePayload())
            ->assertSessionHasErrors('vat_number');
    }

    public function test_admin_crea_cliente_con_email_duplicata_fallisce(): void
    {
        User::factory()->create(['email' => 'test@srl.it']);

        $this->actingAs($this->admin())
            ->post('/customers', $this->validStorePayload())
            ->assertSessionHasErrors('email');
    }

    // --- GET /customers/{customer}/edit ---

    public function test_get_customers_edit_unauthenticated_redirects_to_login(): void
    {
        $customer = Customer::factory()->create();

        $this->get("/customers/{$customer->id}/edit")
            ->assertRedirect(route('login'));
    }

    public function test_cliente_non_puo_accedere_al_form_di_modifica(): void
    {
        $customer = Customer::factory()->create();

        $this->actingAs($this->cliente())
            ->get("/customers/{$customer->id}/edit")
            ->assertForbidden();
    }

    public function test_admin_visualizza_form_di_modifica(): void
    {
        $customer = Customer::factory()->create();

        $this->actingAs($this->admin())
            ->get("/customers/{$customer->id}/edit")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Customers/Edit')
                ->has('customer')
            );
    }

    // --- PUT /customers/{customer} ---

    public function test_put_customer_unauthenticated_redirects_to_login(): void
    {
        $customer = Customer::factory()->create();

        $this->put("/customers/{$customer->id}", [])->assertRedirect(route('login'));
    }

    public function test_cliente_non_puo_aggiornare_cliente(): void
    {
        $customer = Customer::factory()->create();

        $this->actingAs($this->cliente())
            ->put("/customers/{$customer->id}", ['company_name' => 'Test'])
            ->assertForbidden();
    }

    public function test_admin_aggiorna_campo_cliente(): void
    {
        $customer = Customer::factory()->create();

        $this->actingAs($this->admin())
            ->put("/customers/{$customer->id}", ['company_name' => 'Aggiornata Srl'])
            ->assertRedirect(route('customers.index'));

        $this->assertDatabaseHas('customers', [
            'id'           => $customer->id,
            'company_name' => 'Aggiornata Srl',
        ]);
    }

    public function test_admin_aggiorna_vat_number_duplicato_fallisce(): void
    {
        $altro    = Customer::factory()->create(['vat_number' => '11111111111']);
        $customer = Customer::factory()->create(['vat_number' => '22222222222']);

        $this->actingAs($this->admin())
            ->put("/customers/{$customer->id}", ['vat_number' => $altro->vat_number])
            ->assertSessionHasErrors('vat_number');
    }

    // --- DELETE /customers/{customer} ---

    public function test_delete_customer_unauthenticated_redirects_to_login(): void
    {
        $customer = Customer::factory()->create();

        $this->delete("/customers/{$customer->id}")->assertRedirect(route('login'));
    }

    public function test_cliente_non_puo_eliminare_cliente(): void
    {
        // Nessuna pratica: il controllo apps passa, la policy blocca con 403
        $customer = Customer::factory()->create();

        $this->actingAs($this->cliente())
            ->delete("/customers/{$customer->id}")
            ->assertForbidden();
    }

    public function test_admin_elimina_cliente_senza_pratiche(): void
    {
        $customer = Customer::factory()->create();

        $this->actingAs($this->admin())
            ->delete("/customers/{$customer->id}")
            ->assertRedirect(route('customers.index'));

        $this->assertDatabaseMissing('customers', ['id' => $customer->id]);
    }

    public function test_admin_non_puo_eliminare_cliente_con_pratiche(): void
    {
        $customer = Customer::factory()->create();
        Application::factory()->create(['customer_id' => $customer->id]);

        $this->actingAs($this->admin())
            ->from(route('customers.index'))
            ->delete("/customers/{$customer->id}")
            ->assertRedirect(route('customers.index'))
            ->assertSessionHasErrors('delete');
    }
}
