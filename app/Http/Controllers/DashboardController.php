<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

/**
 * Controller invocabile che renderizza la dashboard differenziata per ruolo.
 *
 * Per gli admin restituisce statistiche globali (contatori clienti e pratiche)
 * insieme agli ultimi 5 clienti e alle ultime 5 pratiche.
 * Per i clienti restituisce solo le proprie statistiche e l'elenco delle proprie pratiche.
 */
class DashboardController extends Controller
{
    /**
     * Gestisce la richiesta GET /dashboard.
     *
     * - Ruolo admin: restituisce stats globali, ultimi 5 clienti e ultime 5 pratiche.
     * - Ruolo cliente: restituisce le stats delle sole pratiche del cliente autenticato
     *   e l'elenco completo delle sue pratiche.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Inertia\Response
     */
    public function __invoke(Request $request)
    {
        $user = $request->user()->load('customer');

        if ($user->isAdmin()) {
            return Inertia::render('Dashboard', [
                'stats' => [
                    'total_customers' => Customer::count(),
                    'open'            => Application::where('status', 'Aperta')->count(),
                    'in_lavorazione'  => Application::where('status', 'In Lavorazione')->count(),
                    'chiusa'          => Application::where('status', 'Chiusa')->count(),
                ],
                'latest_customers'    => Customer::with('user:id,email')
                    ->orderByDesc('created_at')->orderByDesc('id')
                    ->take(5)
                    ->get(['id', 'company_name', 'created_at', 'user_id']),
                'latest_applications' => Application::with('customer:id,company_name')
                    ->orderByDesc('created_at')->orderByDesc('id')->take(5)
                    ->get(['id', 'title', 'status', 'customer_id', 'created_at']),
            ]);
        }

        // Ruolo cliente: mostra solo le proprie pratiche
        $customer = $user->customer;

        return Inertia::render('Dashboard', [
            'stats' => [
                'open'           => $customer->applications()->where('status', 'Aperta')->count(),
                'in_lavorazione' => $customer->applications()->where('status', 'In Lavorazione')->count(),
                'chiusa'         => $customer->applications()->where('status', 'Chiusa')->count(),
            ],
            'applications' => $customer->applications()->orderByDesc('created_at')->orderByDesc('id')->get(['id', 'title', 'status', 'created_at']),
        ]);
    }
}
