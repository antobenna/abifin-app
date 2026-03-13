<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCustomerRequest;
use App\Http\Requests\UpdateCustomerRequest;
use App\Models\Customer;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use Inertia\Inertia;

/**
 * Controller CRUD per la gestione dei clienti.
 *
 * I metodi index e show sono accessibili a entrambi i ruoli (admin e cliente);
 * tutti gli altri metodi (create, store, edit, update, destroy) sono riservati agli admin.
 */
class CustomerController extends Controller
{
    /**
     * Renderizza la lista clienti filtrata per ruolo.
     *
     * Gli admin vedono tutti i clienti paginati; i clienti vedono solo il proprio record.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Customer::class);

        if ($request->user()->isAdmin()) {
            // Tutti i clienti paginati per l'admin
            $customers = Customer::with('user')->orderByDesc('created_at')->orderByDesc('id')->paginate(10);
        } else {
            // Solo il record cliente dell'utente autenticato
            $customers = Customer::with('user')
                ->where('user_id', $request->user()->id)
                ->get();
        }

        return Inertia::render('Customers/Index', [
            'customers' => $customers,
        ]);
    }

    /**
     * Renderizza la pagina di dettaglio cliente (sola lettura).
     *
     * @param  \App\Models\Customer  $customer
     * @return \Inertia\Response
     */
    public function show(Customer $customer): \Inertia\Response
    {
        $this->authorize('view', $customer);
        $customer->load('user');
        return Inertia::render('Customers/Show', [
            'customer' => $customer,
        ]);
    }

    /**
     * Renderizza il form di creazione cliente (solo admin).
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        $this->authorize('create', Customer::class);

        return Inertia::render('Customers/Create');
    }

    /**
     * Salva un nuovo cliente e il relativo utente in una singola transazione (solo admin).
     *
     * Crea prima l'account utente con ruolo 'cliente' e poi l'anagrafica cliente collegata.
     *
     * @param  \App\Http\Requests\StoreCustomerRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(StoreCustomerRequest $request)
    {
        $this->authorize('create', Customer::class);

        $validated = $request->validated();

        DB::transaction(function () use ($validated) {
            // 1. Creo l'account utente associato al cliente
            $user = User::create([
                'name'     => $validated['company_name'],
                'email'    => $validated['email'],
                'password' => Hash::make(Str::random(12)),
                'role'     => 'cliente',
            ]);

            // 2. Creo l'anagrafica cliente collegata all'utente
            Customer::create([
                'user_id'      => $user->id,
                'company_name' => $validated['company_name'],
                'vat_number'   => $validated['vat_number'],
                'address'      => $validated['address'] ?? null,
                'phone'        => $validated['phone'] ?? null,
            ]);
        });

        return redirect()->route('customers.index');
    }

    /**
     * Renderizza il form di modifica cliente (solo admin).
     *
     * @param  \App\Models\Customer  $customer
     * @return \Inertia\Response
     */
    public function edit(Customer $customer)
    {
        $this->authorize('update', $customer);
        $customer->load('user');

        return Inertia::render('Customers/Edit', [
            'customer' => $customer,
        ]);
    }

    /**
     * Aggiorna i dati di un cliente esistente (solo admin).
     *
     * Se viene fornita una nuova email, aggiorna anche il record utente associato.
     *
     * @param  \App\Http\Requests\UpdateCustomerRequest  $request
     * @param  \App\Models\Customer  $customer
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(UpdateCustomerRequest $request, Customer $customer)
    {
        $this->authorize('update', $customer);

        $validated = $request->validated();
        $email = $validated['email'] ?? null;

        $customer->update(array_diff_key($validated, ['email' => '']));

        if ($email) {
            $customer->user->update(['email' => $email]);
        }

        return redirect()->route('customers.index');
    }

    /**
     * Elimina un cliente (solo admin).
     *
     * L'eliminazione viene bloccata se il cliente ha pratiche associate,
     * poiché il vincolo di chiave esterna usa onDelete('restrict').
     *
     * @param  \App\Models\Customer  $customer
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Customer $customer)
    {
        // Blocco l'eliminazione se esistono pratiche associate
        if ($customer->applications()->exists()) {
            return redirect()->back()->withErrors([
                'delete' => 'Impossibile eliminare un cliente con pratiche attive.',
            ]);
        }

        $this->authorize('delete', $customer);
        $customer->delete();

        return redirect()->route('customers.index');
    }
}
