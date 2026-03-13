<?php

namespace Tests\Feature;

use App\Models\Application;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Inertia\Testing\AssertableInertia as Assert;
use Tests\TestCase;

class ApplicationTest extends TestCase
{
    use RefreshDatabase;

    private function admin(): User
    {
        return User::factory()->create(['role' => 'admin']);
    }

    private function cliente(): User
    {
        $user = User::factory()->create(['role' => 'cliente']);
        Customer::factory()->create(['user_id' => $user->id]);
        return $user;
    }

    private function validStorePayload(int $customerId, array $overrides = []): array
    {
        return array_merge([
            'title'       => 'Pratica test',
            'description' => null,
            'status'      => 'Aperta',
            'customer_id' => $customerId,
        ], $overrides);
    }

   
    private function validUpdatePayload(int $customerId, array $overrides = []): array
    {
        return array_merge([
            'title'       => 'Pratica aggiornata',
            'description' => null,
            'status'      => 'In Lavorazione',
            'customer_id' => $customerId,
        ], $overrides);
    }

    // --- GET /applications ---

    public function test_get_applications_unauthenticated_redirects_to_login(): void
    {
        $this->get('/applications')->assertRedirect(route('login'));
    }

    public function test_admin_vede_tutte_le_pratiche(): void
    {
        $customer = Customer::factory()->create();
        Application::factory()->count(4)->create(['customer_id' => $customer->id]);

        $this->actingAs($this->admin())
            ->get('/applications')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Applications/Index')
                ->has('applications.data', 4)
                ->has('customers')
            );
    }

    public function test_cliente_vede_solo_le_proprie_pratiche(): void
    {
        $user     = $this->cliente();
        $customer = Customer::where('user_id', $user->id)->first();
        Application::factory()->count(2)->create(['customer_id' => $customer->id]);

        $other = Customer::factory()->create();
        Application::factory()->count(3)->create(['customer_id' => $other->id]);

        $this->actingAs($user)
            ->get('/applications')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('applications.data', 2)
            );
    }

    public function test_cliente_senza_record_customer_vede_lista_vuota(): void
    {
        $user = User::factory()->create(['role' => 'cliente']);

        $this->actingAs($user)
            ->get('/applications')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->has('applications', 0)
            );
    }

    // --- GET /applications/create ---

    public function test_get_applications_create_unauthenticated_redirects_to_login(): void
    {
        $this->get('/applications/create')->assertRedirect(route('login'));
    }

    public function test_cliente_non_puo_accedere_al_form_di_creazione(): void
    {
        $this->actingAs($this->cliente())
            ->get('/applications/create')
            ->assertForbidden();
    }

    public function test_admin_visualizza_form_di_creazione_con_clienti(): void
    {
        Customer::factory()->count(2)->create();

        $this->actingAs($this->admin())
            ->get('/applications/create')
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Applications/Create')
                ->has('customers', 2)
            );
    }

    // --- POST /applications ---

    public function test_post_applications_unauthenticated_redirects_to_login(): void
    {
        $this->post('/applications', [])->assertRedirect(route('login'));
    }

    public function test_cliente_non_puo_creare_pratica(): void
    {
        $customer = Customer::factory()->create();

        $this->actingAs($this->cliente())
            ->post('/applications', $this->validStorePayload($customer->id))
            ->assertForbidden();
    }

    public function test_admin_crea_pratica_con_dati_validi(): void
    {
        $customer = Customer::factory()->create();

        $this->actingAs($this->admin())
            ->post('/applications', $this->validStorePayload($customer->id))
            ->assertRedirect(route('applications.index'));

        $this->assertDatabaseHas('applications', [
            'title'       => 'Pratica test',
            'customer_id' => $customer->id,
        ]);
    }

    public function test_admin_crea_pratica_con_status_non_valido_fallisce(): void
    {
        $customer = Customer::factory()->create();

        $this->actingAs($this->admin())
            ->post('/applications', $this->validStorePayload($customer->id, ['status' => 'Sospesa']))
            ->assertSessionHasErrors('status');
    }

    public function test_admin_crea_pratica_con_customer_id_inesistente_fallisce(): void
    {
        $this->actingAs($this->admin())
            ->post('/applications', $this->validStorePayload(99999))
            ->assertSessionHasErrors('customer_id');
    }

    // --- GET /applications/{application}/edit ---

    public function test_get_applications_edit_unauthenticated_redirects_to_login(): void
    {
        $customer    = Customer::factory()->create();
        $application = Application::factory()->create(['customer_id' => $customer->id]);

        $this->get("/applications/{$application->id}/edit")
            ->assertRedirect(route('login'));
    }

    public function test_cliente_non_puo_accedere_al_form_di_modifica(): void
    {
        $customer    = Customer::factory()->create();
        $application = Application::factory()->create(['customer_id' => $customer->id]);

        $this->actingAs($this->cliente())
            ->get("/applications/{$application->id}/edit")
            ->assertForbidden();
    }

    public function test_admin_visualizza_form_di_modifica(): void
    {
        $customer    = Customer::factory()->create();
        $application = Application::factory()->create(['customer_id' => $customer->id]);

        $this->actingAs($this->admin())
            ->get("/applications/{$application->id}/edit")
            ->assertOk()
            ->assertInertia(fn (Assert $page) => $page
                ->component('Applications/Edit')
                ->has('application')
                ->has('customers')
            );
    }

    // --- PUT /applications/{application} ---

    public function test_put_application_unauthenticated_redirects_to_login(): void
    {
        $customer    = Customer::factory()->create();
        $application = Application::factory()->create(['customer_id' => $customer->id]);

        $this->put("/applications/{$application->id}", [])->assertRedirect(route('login'));
    }

    public function test_cliente_non_puo_aggiornare_pratica(): void
    {
        $customer    = Customer::factory()->create();
        $application = Application::factory()->create(['customer_id' => $customer->id]);

        $this->actingAs($this->cliente())
            ->put("/applications/{$application->id}", $this->validUpdatePayload($customer->id))
            ->assertForbidden();
    }

    public function test_admin_aggiorna_status_pratica(): void
    {
        $customer    = Customer::factory()->create();
        $application = Application::factory()->create(['customer_id' => $customer->id]);

        $this->actingAs($this->admin())
            ->put("/applications/{$application->id}", $this->validUpdatePayload($customer->id, ['status' => 'Chiusa']))
            ->assertRedirect(route('applications.index'));

        $this->assertDatabaseHas('applications', [
            'id'     => $application->id,
            'status' => 'Chiusa',
        ]);
    }

    public function test_admin_aggiorna_pratica_con_status_non_valido_fallisce(): void
    {
        $customer    = Customer::factory()->create();
        $application = Application::factory()->create(['customer_id' => $customer->id]);

        $this->actingAs($this->admin())
            ->put("/applications/{$application->id}", $this->validUpdatePayload($customer->id, ['status' => 'Invalido']))
            ->assertSessionHasErrors('status');
    }

    // --- DELETE /applications/{application} ---

    public function test_delete_application_unauthenticated_redirects_to_login(): void
    {
        $customer    = Customer::factory()->create();
        $application = Application::factory()->create(['customer_id' => $customer->id]);

        $this->delete("/applications/{$application->id}")->assertRedirect(route('login'));
    }

    public function test_cliente_non_puo_eliminare_pratica(): void
    {
        $customer    = Customer::factory()->create();
        $application = Application::factory()->create(['customer_id' => $customer->id]);

        $this->actingAs($this->cliente())
            ->delete("/applications/{$application->id}")
            ->assertForbidden();
    }

    public function test_admin_elimina_pratica(): void
    {
        $customer    = Customer::factory()->create();
        $application = Application::factory()->create(['customer_id' => $customer->id]);

        $this->actingAs($this->admin())
            ->delete("/applications/{$application->id}")
            ->assertRedirect(route('applications.index'));

        $this->assertDatabaseMissing('applications', ['id' => $application->id]);
    }
}
