<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreApplicationRequest;
use App\Http\Requests\UpdateApplicationRequest;
use App\Models\Application;
use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ApplicationController extends Controller
{
    // Renderizza la lista pratiche filtrata per ruolo
    public function index(Request $request)
    {
        if (! $request->user()->isAdmin()) {
            return redirect()->route('dashboard');
        }

        $this->authorize('viewAny', Application::class);

        $query = Application::with('customer');

        if (! $request->user()->isAdmin()) {
            // 1. Recupero il record cliente associato all'utente autenticato
            $customer = Customer::where('user_id', $request->user()->id)->first();
            if (! $customer) {
                return Inertia::render('Applications/Index', [
                    'applications' => [],
                    'customers'    => [],
                ]);
            }
            // 2. Limito i risultati alle sole pratiche del cliente
            $query->where('customer_id', $customer->id);
        }

        $applications = $query->orderByDesc('created_at')->orderByDesc('id')->paginate(10);

        // Lista clienti per il filtro (solo admin)
        $customers = $request->user()->isAdmin()
            ? Customer::orderBy('company_name')->get(['id', 'company_name'])
            : [];

        return Inertia::render('Applications/Index', [
            'applications' => $applications,
            'customers'    => $customers,
        ]);
    }

    // Renderizza la pagina di dettaglio pratica (sola lettura)
    public function show(Application $application): \Inertia\Response
    {
        $this->authorize('view', $application);
        $application->load('customer');
        return Inertia::render('Applications/Show', [
            'application' => $application,
        ]);
    }

    // Renderizza il form di creazione pratica (solo admin)
    public function create(Request $request)
    {
        $this->authorize('create', Application::class);

        $customers = Customer::orderBy('company_name')->get(['id', 'company_name']);

        return Inertia::render('Applications/Create', [
            'customers' => $customers,
        ]);
    }

    // Salva una nuova pratica (solo admin)
    public function store(StoreApplicationRequest $request)
    {
        $this->authorize('create', Application::class);

        Application::create($request->validated());

        return redirect()->route('applications.index');
    }

    // Renderizza il form di modifica pratica (solo admin)
    public function edit(Application $application)
    {
        $this->authorize('update', $application);

        $customers = Customer::orderBy('company_name')->get(['id', 'company_name']);

        return Inertia::render('Applications/Edit', [
            'application' => $application->load('customer'),
            'customers'   => $customers,
        ]);
    }

    // Aggiorna una pratica esistente (solo admin)
    public function update(UpdateApplicationRequest $request, Application $application)
    {
        $this->authorize('update', $application);

        $application->update($request->validated());

        return redirect()->route('applications.index');
    }

    // Elimina una pratica (solo admin)
    public function destroy(Application $application)
    {
        $this->authorize('delete', $application);
        $application->delete();

        return redirect()->route('applications.index');
    }
}
