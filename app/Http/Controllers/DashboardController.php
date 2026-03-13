<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
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

        // Ruolo cliente
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
