<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Customer extends Model
{
    use HasFactory;

    // Campi
    protected $fillable = [
        'company_name',
        'address',
        'vat_number',
        'phone',
        'user_id'
    ];

    // Ogni cliente è legato a un utente
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    // Ogni cliente può avere una o piu pratiche
    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }
}
