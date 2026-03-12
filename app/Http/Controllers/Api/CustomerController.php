<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreCustomerRequest;
use App\Http\Requests\Api\UpdateCustomerRequest;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class CustomerController extends Controller
{
    // Restituisce la lista dei clienti filtrata per ruolo
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Customer::class);

        if ($request->user()->isAdmin()) {
            // Tutti i clienti paginati per l'admin
            $customers = Customer::with('user')->latest()->paginate(25);
        } else {
            // Solo il record cliente dell'utente autenticato
            $customers = Customer::with('user')
                ->where('user_id', $request->user()->id)
                ->get();
        }

        return response()->json($customers);
    }

    // Crea un nuovo cliente e il relativo utente (solo admin)
    public function store(StoreCustomerRequest $request): JsonResponse
    {
        $this->authorize('create', Customer::class);

        $validated = $request->validated();

        return DB::transaction(function () use ($validated) {
            // 1. Creo l'account utente associato al cliente
            $user = User::create([
                'name'     => $validated['company_name'],
                'email'    => $validated['email'],
                'password' => Hash::make(Str::random(12)),
                'role'     => 'cliente',
            ]);

            // 2. Creo l'anagrafica cliente collegata all'utente
            $customer = Customer::create([
                'user_id'      => $user->id,
                'company_name' => $validated['company_name'],
                'vat_number'   => $validated['vat_number'],
                'address'      => $validated['address'] ?? null,
                'phone'        => $validated['phone'] ?? null,
            ]);

            // 3. Restituisco il cliente con i dati utente in eager loading
            return response()->json($customer->load('user'), 201);
        });
    }

    // Aggiorna i dati di un cliente esistente (solo admin)
    public function update(UpdateCustomerRequest $request, Customer $customer): JsonResponse
    {
        $this->authorize('update', $customer);

        $customer->update($request->validated());

        return response()->json($customer->load('user'));
    }

    // Elimina un cliente (solo admin, bloccato se ha pratiche attive)
    public function destroy(Customer $customer): JsonResponse
    {
        // Blocco l'eliminazione se esistono pratiche associate
        if ($customer->applications()->exists()) {
            return response()->json(['error' => 'Impossibile eliminare un cliente con pratiche attive.'], 422);
        }

        $this->authorize('delete', $customer);
        $customer->delete();

        return response()->json(['message' => 'Cliente eliminato.']);
    }
}
