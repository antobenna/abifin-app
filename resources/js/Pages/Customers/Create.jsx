import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm } from '@inertiajs/react';
import CustomerForm from '@/Components/Form/CustomerForm';

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

            <CustomerForm
                data={data}
                setData={setData}
                errors={errors}
                onSubmit={submit}
                cancelHref={route('customers.index')}
                processing={processing}
                subtitle="Inserisci le informazioni per il nuovo cliente."
            />
        </AuthenticatedLayout>
    );
}
