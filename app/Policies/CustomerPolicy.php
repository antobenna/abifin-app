<?php

namespace App\Policies;

use App\Models\Customer;
use App\Models\User;

/**
 * Regole di autorizzazione per il modello Cliente.
 *
 * La lettura è consentita a entrambi i ruoli; le operazioni di scrittura
 * (creazione, modifica, eliminazione) sono riservate agli admin.
 */
class CustomerPolicy
{
    /**
     * Entrambi i ruoli possono listare i clienti; il filtraggio avviene nel controller.
     */
    public function viewAny(User $user): bool { return true; }

    /**
     * L'admin può vedere qualsiasi cliente; il cliente può vedere solo il proprio record.
     */
    public function view(User $user, Customer $customer): bool
    {
        return $user->isAdmin() || $customer->user_id === $user->id;
    }

    /** Solo l'admin può creare nuovi clienti. */
    public function create(User $user): bool { return $user->isAdmin(); }

    /** Solo l'admin può modificare i clienti. */
    public function update(User $user, Customer $customer): bool { return $user->isAdmin(); }

    /** Solo l'admin può eliminare i clienti. */
    public function delete(User $user, Customer $customer): bool { return $user->isAdmin(); }
}
