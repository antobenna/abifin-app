import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button, Input, Select, SelectItem, Textarea } from '@heroui/react';

const STATUSES = ['Aperta', 'In Lavorazione', 'Chiusa'];

export default function Edit({ application, customers }) {
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

            <div className="py-12">
                <div className="mx-auto max-w-2xl sm:px-6 lg:px-8">
                    <form onSubmit={submit} className="space-y-4 rounded-lg bg-white p-6 shadow-sm">
                        <Input
                            label="Titolo"
                            value={data.title}
                            onValueChange={(v) => setData('title', v)}
                            isInvalid={!!errors.title}
                            errorMessage={errors.title}
                            isRequired
                        />
                        <Textarea
                            label="Descrizione"
                            value={data.description}
                            onValueChange={(v) => setData('description', v)}
                            isInvalid={!!errors.description}
                            errorMessage={errors.description}
                        />
                        <Select
                            label="Stato"
                            selectedKeys={[data.status]}
                            onSelectionChange={(keys) => setData('status', [...keys][0])}
                            isInvalid={!!errors.status}
                            errorMessage={errors.status}
                            isRequired
                        >
                            {STATUSES.map((s) => (
                                <SelectItem key={s}>{s}</SelectItem>
                            ))}
                        </Select>
                        <Select
                            label="Cliente"
                            selectedKeys={[String(data.customer_id)]}
                            onSelectionChange={(keys) => setData('customer_id', Number([...keys][0]))}
                            isInvalid={!!errors.customer_id}
                            errorMessage={errors.customer_id}
                            isRequired
                        >
                            {customers.map((c) => (
                                <SelectItem key={String(c.id)}>{c.company_name}</SelectItem>
                            ))}
                        </Select>

                        <div className="flex justify-end gap-2 pt-2">
                            <Button as={Link} href={route('applications.index')} variant="flat">
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
