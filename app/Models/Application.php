<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

/**
 * Modello che rappresenta una pratica/caso lavorativo.
 *
 * @property string $status  Stato della pratica: 'Aperta', 'In Lavorazione' oppure 'Chiusa'.
 */
class Application extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'status',
        'customer_id',
    ];

    /**
     * Cliente a cui appartiene questa pratica.
     *
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo
     */
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }
}
