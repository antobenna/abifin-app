<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreApplicationRequest;
use App\Http\Requests\UpdateApplicationRequest;
use App\Models\Application;
use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Controller CRUD per la gestione delle pratiche.
 *
 * Tutti i metodi sono riservati agli admin; i clienti vengono
 * reindirizzati alla dashboard se tentano di accedere all'elenco pratiche.
 */
class ApplicationController extends Controller
{
    /**
     * Renderizza la lista pratiche (solo admin).
     *
     * I non-admin vengono reindirizzati alla dashboard prima di raggiungere questo punto.
     * Restituisce le pratiche paginate con il relativo cliente e la lista clienti per i filtri.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        if (! $request->user()->isAdmin()) {
            return redirect()->route('dashboard');
        }

        $this->authorize('viewAny', Application::class);

        $applications = Application::with('customer')
            ->orderByDesc('created_at')->orderByDesc('id')
            ->paginate(10);

        // Lista clienti per il filtro (solo admin)
        $customers = $request->user()->isAdmin()
            ? Customer::orderBy('company_name')->get(['id', 'company_name'])
            : [];

        return Inertia::render('Applications/Index', [
            'applications' => $applications,
            'customers'    => $customers,
        ]);
    }

    /**
     * Renderizza la pagina di dettaglio pratica (sola lettura).
     *
     * @param  \App\Models\Application  $application
     * @return \Inertia\Response
     */
    public function show(Application $application): \Inertia\Response
    {
        $this->authorize('view', $application);
        $application->load('customer');
        return Inertia::render('Applications/Show', [
            'application' => $application,
        ]);
    }

    /**
     * Renderizza il form di creazione pratica (solo admin).
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function create(Request $request)
    {
        $this->authorize('create', Application::class);

        $customers = Customer::orderBy('company_name')->get(['id', 'company_name']);

        return Inertia::render('Applications/Create', [
            'customers' => $customers,
        ]);
    }

    /**
     * Salva una nuova pratica (solo admin).
     *
     * @param  \App\Http\Requests\StoreApplicationRequest  $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(StoreApplicationRequest $request)
    {
        $this->authorize('create', Application::class);

        Application::create($request->validated());

        return redirect()->route('applications.index');
    }

    /**
     * Renderizza il form di modifica pratica (solo admin).
     *
     * @param  \App\Models\Application  $application
     * @return \Inertia\Response
     */
    public function edit(Application $application)
    {
        $this->authorize('update', $application);

        $customers = Customer::orderBy('company_name')->get(['id', 'company_name']);

        return Inertia::render('Applications/Edit', [
            'application' => $application->load('customer'),
            'customers'   => $customers,
        ]);
    }

    /**
     * Aggiorna una pratica esistente (solo admin).
     *
     * @param  \App\Http\Requests\UpdateApplicationRequest  $request
     * @param  \App\Models\Application  $application
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(UpdateApplicationRequest $request, Application $application)
    {
        $this->authorize('update', $application);

        $application->update($request->validated());

        return redirect()->route('applications.index');
    }

    /**
     * Elimina una pratica (solo admin).
     *
     * @param  \App\Models\Application  $application
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Application $application)
    {
        $this->authorize('delete', $application);
        $application->delete();

        return redirect()->route('applications.index');
    }
}
