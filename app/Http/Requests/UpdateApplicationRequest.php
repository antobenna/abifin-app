<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Form request per la validazione dell'aggiornamento parziale di una pratica esistente.
 *
 * Tutti i campi sono opzionali (sometimes); vengono validati solo se presenti nella richiesta.
 */
class UpdateApplicationRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'title'       => ['sometimes','required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            'status'      => ['sometimes', 'required', 'in:Aperta,In Lavorazione,Chiusa'],
            'customer_id' => ['sometimes','required', 'integer', 'exists:customers,id'],
        ];
    }
}
