<?php

namespace App\Policies;

use App\Models\Application;
use App\Models\User;

class ApplicationPolicy
{
    // Entrambi i ruoli possono listare; il filtraggio avviene nel controller
    public function viewAny(User $user): bool
    {
        return true;
    }

    // Admin: qualsiasi pratica; cliente: solo le proprie (via customer.user_id)
    public function view(User $user, Application $application): bool
    {
        return $user->isAdmin() || $application->customer->user_id === $user->id;
    }

    public function create(User $user): bool { return $user->isAdmin(); }
    public function update(User $user, Application $application): bool { return $user->isAdmin(); }
    public function delete(User $user, Application $application): bool { return $user->isAdmin(); }
}
