import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, useForm, usePage } from '@inertiajs/react';
import ApplicationForm from '@/Components/Form/ApplicationForm';

export default function Edit({ application, customers }) {
    const { auth } = usePage().props;
    const isAdmin = auth.user.role === 'admin';

    const { data, setData, put, processing, errors } = useForm({
        title: application.title,
        description: application.description ?? '',
        status: application.status,
        customer_id: application.customer_id,
    });

    function submit(e) {
        e.preventDefault();
        put(route('applications.update', application.id));
    }

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">Modifica Pratica</h2>
            }
        >
            <Head title="Modifica Pratica" />

            <ApplicationForm
                data={data}
                setData={setData}
                errors={errors}
                onSubmit={submit}
                cancelHref={route('applications.index')}
                processing={processing}
                customers={customers}
                isAdmin={isAdmin}
                subtitle="Aggiorna le informazioni relative alla pratica selezionata."
            />
        </AuthenticatedLayout>
    );
}
