<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Application extends Model
{
    use HasFactory;

    // Campi
    protected $fillable = [
        'title',
        'description',
        'status',
        'customer_id',
    ];

    // Ogni pratica appartiene ad un Customer
    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }
}
