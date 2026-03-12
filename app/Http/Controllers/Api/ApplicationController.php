<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\Api\StoreApplicationRequest;
use App\Http\Requests\Api\UpdateApplicationRequest;
use App\Models\Application;
use App\Models\Customer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ApplicationController extends Controller
{
    // Restituisce la lista delle pratiche filtrata per ruolo
    public function index(Request $request): JsonResponse
    {
        $this->authorize('viewAny', Application::class);

        $query = Application::with('customer');

        if (! $request->user()->isAdmin()) {
            // 1. Recupero il record cliente associato all'utente autenticato
            $customer = Customer::where('user_id', $request->user()->id)->first();
            if (! $customer) {
                return response()->json(['data' => []], 200);
            }
            // 2. Limito i risultati alle sole pratiche del cliente
            $query->where('customer_id', $customer->id);
        } else {
            // Filtro opzionale per customer_id (solo admin)
            if ($request->filled('customer_id')) {
                $query->where('customer_id', (int) $request->input('customer_id'));
            }
        }

        // Filtro opzionale per stato
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        $limit = min((int) $request->input('limit', 25), 100);

        return response()->json($query->latest()->paginate($limit));
    }

    // Crea una nuova pratica (solo admin)
    public function store(StoreApplicationRequest $request): JsonResponse
    {
        $this->authorize('create', Application::class);

        $application = Application::create($request->validated());

        return response()->json($application->load('customer'), 201);
    }

    // Aggiorna una pratica esistente (solo admin)
    public function update(UpdateApplicationRequest $request, Application $application): JsonResponse
    {
        $this->authorize('update', $application);

        $application->update($request->validated());

        return response()->json($application->load('customer'));
    }

    // Elimina una pratica (solo admin)
    public function destroy(Application $application): JsonResponse
    {
        $this->authorize('delete', $application);
        $application->delete();

        return response()->json(['message' => 'Pratica eliminata.']);
    }
}
