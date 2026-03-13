import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import ApplicationForm from '@/Components/Form/ApplicationForm';

export default function Create({ customers }) {
    const { auth } = usePage().props;
    const isAdmin = auth.user.role === 'admin';

    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        status: 'Aperta',
        customer_id: '',
    });

    function submit(e) {
        e.preventDefault();
        post(route('applications.store'));
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">Nuova Pratica</h2>
            }
        >
            <Head title="Nuova Pratica" />

            <ApplicationForm
                data={data}
                setData={setData}
                errors={errors}
                onSubmit={submit}
                cancelHref={route('applications.index')}
                processing={processing}
                customers={customers}
                isAdmin={isAdmin}
                subtitle="Inserisci le informazioni per la nuova pratica."
            />
        </AuthenticatedLayout>
    );
}
