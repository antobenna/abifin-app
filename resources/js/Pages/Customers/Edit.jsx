import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import CustomerForm from '@/Components/Form/CustomerForm';

export default function Edit({ customer }) {
    const { data, setData, put, processing, errors } = useForm({
        company_name: customer.company_name,
        vat_number: customer.vat_number,
        address: customer.address ?? '',
        phone: customer.phone ?? '',
        email: customer.user?.email ?? '',
    });

    function submit(e) {
        e.preventDefault();
        put(route('customers.update', customer.id));
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">Modifica Cliente</h2>
            }
        >
            <Head title="Modifica Cliente" />

            <CustomerForm
                data={data}
                setData={setData}
                errors={errors}
                onSubmit={submit}
                cancelHref={route('customers.index')}
                processing={processing}
                subtitle="Aggiorna le informazioni relative al profilo del cliente selezionato."
            />
        </AuthenticatedLayout>
    );
}
