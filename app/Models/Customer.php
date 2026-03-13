<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Modello che rappresenta l'anagrafica di un'azienda cliente.
 *
 * @property string $vat_number  Partita IVA italiana (esattamente 11 caratteri numerici).
 */
class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'company_name',
        'address',
        'vat_number',
        'phone',
        'user_id'
    ];

    /**
     * Utente autenticato associato a questo cliente.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Pratiche associate al cliente.
     *
     * Non è possibile eliminare il cliente se esistono pratiche collegate
     * (vincolo onDelete('restrict') sulla chiave esterna).
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }
}
