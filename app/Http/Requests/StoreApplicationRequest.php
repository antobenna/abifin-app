<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Form request per la validazione della creazione di una nuova pratica.
 */
class StoreApplicationRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'title'       => ['required', 'string', 'max:255'],
            'description' => ['nullable', 'string'],
            // Valori ammessi per lo stato: 'Aperta', 'In Lavorazione', 'Chiusa'
            'status'      => ['required', 'in:Aperta,In Lavorazione,Chiusa'],
            'customer_id' => ['required', 'integer', 'exists:customers,id'],
        ];
    }
}
