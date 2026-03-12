import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button, Input } from '@heroui/react';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        company_name: '',
        vat_number: '',
        address: '',
        phone: '',
        email: '',
    });

    function submit(e) {
        e.preventDefault();
        post(route('customers.store'));
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">Nuovo Cliente</h2>
            }
        >
            <Head title="Nuovo Cliente" />

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-4 rounded-lg bg-white p-6 shadow-sm">
                        <Input
                            label="Ragione Sociale"
                            value={data.company_name}
                            onValueChange={(v) => setData('company_name', v)}
                            isInvalid={!!errors.company_name}
                            errorMessage={errors.company_name}
                            isRequired
                        />
                        <Input
                            label="P.IVA"
                            value={data.vat_number}
                            onValueChange={(v) => setData('vat_number', v)}
                            isInvalid={!!errors.vat_number}
                            errorMessage={errors.vat_number}
                            isRequired
                        />
                        <Input
                            label="Indirizzo"
                            value={data.address}
                            onValueChange={(v) => setData('address', v)}
                            isInvalid={!!errors.address}
                            errorMessage={errors.address}
                            isRequired
                        />
                        <Input
                            label="Telefono"
                            value={data.phone}
                            onValueChange={(v) => setData('phone', v)}
                            isInvalid={!!errors.phone}
                            errorMessage={errors.phone}
                            isRequired
                        />
                        <Input
                            label="Email"
                            type="email"
                            value={data.email}
                            onValueChange={(v) => setData('email', v)}
                            isInvalid={!!errors.email}
                            errorMessage={errors.email}
                            isRequired
                        />

                        <div className="flex justify-end gap-2 pt-2">
                            <Button as={Link} href={route('customers.index')} variant="flat">
                                Annulla
                            </Button>
                            <Button type="submit" color="primary" isLoading={processing}>
                                Salva
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
