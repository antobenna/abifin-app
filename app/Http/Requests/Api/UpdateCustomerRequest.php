<?php

namespace App\Http\Requests\Api;

use Illuminate\Foundation\Http\FormRequest;

class UpdateCustomerRequest extends FormRequest
{
    public function authorize(): bool { return true; }

    public function rules(): array
    {
        return [
            'company_name' => ['sometimes', 'required', 'string', 'max:255'],
            'address'      => ['nullable', 'string', 'max:255'],
            'vat_number'   => ['sometimes', 'required', 'string', 'max:11', 'unique:customers,vat_number,' . $this->route('customer')->id],
            'phone'        => ['nullable', 'string', 'max:20'],
            'user_id'      => ['sometimes', 'required', 'integer', 'exists:users,id'],
        ];
    }
}
