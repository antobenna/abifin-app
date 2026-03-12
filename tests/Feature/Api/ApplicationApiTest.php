<?php

namespace Tests\Feature\Api;

use App\Models\Application;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class ApplicationApiTest extends TestCase
{
    use RefreshDatabase;

    // Crea un utente con ruolo admin
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

    // --- GET /api/applications ---

    public function test_get_applications_unauthenticated_returns_401(): void
    {
        $this->getJson('/api/applications')->assertUnauthorized();
    }

    public function test_admin_vede_tutte_le_pratiche(): void
    {
        Application::factory()->count(4)->create();

        Sanctum::actingAs($this->admin());

        $this->getJson('/api/applications')->assertOk()->assertJsonCount(4, 'data');
    }

    public function test_cliente_vede_solo_le_proprie_pratiche(): void
    {
        $user = $this->cliente();
        $customer = Customer::where('user_id', $user->id)->first();

        // Pratiche del cliente
        Application::factory()->count(2)->create(['customer_id' => $customer->id]);
        // Pratiche di altri clienti
        Application::factory()->count(3)->create();

        Sanctum::actingAs($user);

        $response = $this->getJson('/api/applications')->assertOk();
        $this->assertCount(2, $response->json('data'));
    }

    public function test_admin_filtra_pratiche_per_customer_id(): void
    {
        $customer = Customer::factory()->create();
        Application::factory()->count(2)->create(['customer_id' => $customer->id]);
        Application::factory()->count(3)->create(); // altri clienti

        Sanctum::actingAs($this->admin());

        $response = $this->getJson("/api/applications?customer_id={$customer->id}")->assertOk();
        $this->assertCount(2, $response->json('data'));
    }

    public function test_admin_filtra_pratiche_per_status(): void
    {
        Application::factory()->count(2)->create(['status' => 'Aperta']);
        Application::factory()->count(3)->create(['status' => 'Chiusa']);

        Sanctum::actingAs($this->admin());

        $response = $this->getJson('/api/applications?status=Aperta')->assertOk();
        $this->assertCount(2, $response->json('data'));
    }

    // --- POST /api/applications ---

    public function test_post_applications_unauthenticated_returns_401(): void
    {
        $this->postJson('/api/applications', [])->assertUnauthorized();
    }

    public function test_cliente_non_puo_creare_pratica(): void
    {
        $customer = Customer::factory()->create();

        Sanctum::actingAs($this->cliente());

        $this->postJson('/api/applications', [
            'title'       => 'Nuova pratica',
            'status'      => 'Aperta',
            'customer_id' => $customer->id,
        ])->assertForbidden();
    }

    public function test_admin_crea_pratica_con_dati_validi(): void
    {
        $customer = Customer::factory()->create();

        Sanctum::actingAs($this->admin());

        $this->postJson('/api/applications', [
            'title'       => 'Pratica test',
            'status'      => 'Aperta',
            'customer_id' => $customer->id,
        ])->assertCreated();

        $this->assertDatabaseHas('applications', [
            'title'       => 'Pratica test',
            'customer_id' => $customer->id,
        ]);
    }

    public function test_admin_crea_pratica_con_status_non_valido_returns_422(): void
    {
        $customer = Customer::factory()->create();

        Sanctum::actingAs($this->admin());

        $this->postJson('/api/applications', [
            'title'       => 'Pratica test',
            'status'      => 'Sospesa',
            'customer_id' => $customer->id,
        ])->assertUnprocessable();
    }

    public function test_admin_crea_pratica_con_customer_id_inesistente_returns_422(): void
    {
        Sanctum::actingAs($this->admin());

        $this->postJson('/api/applications', [
            'title'       => 'Pratica test',
            'status'      => 'Aperta',
            'customer_id' => 99999,
        ])->assertUnprocessable();
    }

    // --- PUT /api/applications/{application} ---

    public function test_put_application_unauthenticated_returns_401(): void
    {
        $application = Application::factory()->create();

        $this->putJson("/api/applications/{$application->id}", [])->assertUnauthorized();
    }

    public function test_cliente_non_puo_aggiornare_pratica(): void
    {
        $application = Application::factory()->create();

        Sanctum::actingAs($this->cliente());

        $this->putJson("/api/applications/{$application->id}", [
            'status' => 'Chiusa',
        ])->assertForbidden();
    }

    public function test_admin_aggiorna_status_pratica(): void
    {
        $application = Application::factory()->create(['status' => 'Aperta']);

        Sanctum::actingAs($this->admin());

        $this->putJson("/api/applications/{$application->id}", [
            'status' => 'Chiusa',
        ])->assertOk();

        $this->assertDatabaseHas('applications', [
            'id'     => $application->id,
            'status' => 'Chiusa',
        ]);
    }

    public function test_admin_aggiorna_pratica_con_status_non_valido_returns_422(): void
    {
        $application = Application::factory()->create();

        Sanctum::actingAs($this->admin());

        $this->putJson("/api/applications/{$application->id}", [
            'status' => 'Invalido',
        ])->assertUnprocessable();
    }

    // --- DELETE /api/applications/{application} ---

    public function test_delete_application_unauthenticated_returns_401(): void
    {
        $application = Application::factory()->create();

        $this->deleteJson("/api/applications/{$application->id}")->assertUnauthorized();
    }

    public function test_cliente_non_puo_eliminare_pratica(): void
    {
        $application = Application::factory()->create();

        Sanctum::actingAs($this->cliente());

        $this->deleteJson("/api/applications/{$application->id}")->assertForbidden();
    }

    public function test_admin_elimina_pratica(): void
    {
        $application = Application::factory()->create();

        Sanctum::actingAs($this->admin());

        $this->deleteJson("/api/applications/{$application->id}")->assertOk();

        $this->assertDatabaseMissing('applications', ['id' => $application->id]);
    }
}
