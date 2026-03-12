<?php

namespace App\Policies;

use App\Models\Customer;
use App\Models\User;

class CustomerPolicy
{
    // Entrambi i ruoli possono listare; il filtraggio avviene nel controller
    public function viewAny(User $user): bool { return true; }

    // Admin: qualsiasi cliente; cliente: solo il proprio record
    public function view(User $user, Customer $customer): bool
    {
        return $user->isAdmin() || $customer->user_id === $user->id;
    }

    public function create(User $user): bool { return $user->isAdmin(); }
    public function update(User $user, Customer $customer): bool { return $user->isAdmin(); }
    public function delete(User $user, Customer $customer): bool { return $user->isAdmin(); }
}
