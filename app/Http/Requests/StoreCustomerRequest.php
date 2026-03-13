<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

/**
 * Form request per la validazione della creazione di un nuovo cliente.
 */
class StoreCustomerRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'company_name' => ['required', 'string', 'max:255'],
            'address'      => ['required', 'string', 'max:255'],
            // La Partita IVA italiana è composta esattamente da 11 caratteri numerici
            'vat_number'   => ['required', 'string', 'size:11', 'unique:customers,vat_number'],
            'phone'        => ['required', 'string', 'max:20'],
            'email'        => ['required', 'email', 'max:255', 'unique:users,email'],
        ];
    }
}
