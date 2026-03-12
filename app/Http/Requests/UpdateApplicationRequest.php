<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

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
