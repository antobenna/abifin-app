<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Form request per la validazione dell'aggiornamento parziale di un cliente esistente.
 *
 * Tutti i campi sono opzionali (sometimes); vengono validati solo se presenti nella richiesta.
 */
class UpdateCustomerRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'company_name' => ['sometimes', 'required', 'string', 'max:255'],
            'address'      => ['sometimes', 'required', 'string', 'max:255'],
            'vat_number'   => ['sometimes', 'required', 'string', 'max:11', 'unique:customers,vat_number,' . $this->route('customer')->id],
            'phone'        => ['sometimes', 'required', 'string', 'max:20'],
            'email'        => ['sometimes', 'required', 'email', 'max:255',
                'unique:users,email,' . $this->route('customer')->user_id],
        ];
    }
}
