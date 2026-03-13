<?php

namespace App\Policies;

use App\Models\Application;
use App\Models\User;

/**
 * Regole di autorizzazione per il modello Pratica.
 *
 * La lettura è consentita a entrambi i ruoli; le operazioni di scrittura
 * (creazione, modifica, eliminazione) sono riservate agli admin.
 */
class ApplicationPolicy
{
    /**
     * Entrambi i ruoli possono listare le pratiche; il filtraggio avviene nel controller.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * L'admin può vedere qualsiasi pratica; il cliente può vedere solo le proprie
     * (verificato tramite customer.user_id).
     */
    public function view(User $user, Application $application): bool
    {
        return $user->isAdmin() || $application->customer->user_id === $user->id;
    }

    /** Solo l'admin può creare nuove pratiche. */
    public function create(User $user): bool { return $user->isAdmin(); }

    /** Solo l'admin può modificare le pratiche. */
    public function update(User $user, Application $application): bool { return $user->isAdmin(); }

    /** Solo l'admin può eliminare le pratiche. */
    public function delete(User $user, Application $application): bool { return $user->isAdmin(); }
}
