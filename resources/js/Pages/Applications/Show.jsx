import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Chip, Button } from '@heroui/react';

const statusColor = { Aperta: 'success', 'In Lavorazione': 'warning', Chiusa: 'default' };

export default function Show({ application }) {
    const { auth } = usePage().props;
    const isAdmin = auth.user.role === 'admin';

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">Dettaglio Pratica</h2>
            }
        >
            <Head title="Dettaglio Pratica" />

            <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-bold text-primary">#{application.id}</h3>
                        <Chip color={statusColor[application.status] ?? 'default'} size="sm" variant="flat">
                            {application.status}
                        </Chip>
                    </div>

                    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <dt className="text-xs font-medium text-default-400 uppercase tracking-wide">Titolo</dt>
                            <dd className="mt-1 text-sm text-default-700">{application.title}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-default-400 uppercase tracking-wide">Cliente</dt>
                            <dd className="mt-1 text-sm text-default-700">{application.customer?.company_name ?? '—'}</dd>
                        </div>
                        <div className="sm:col-span-2">
                            <dt className="text-xs font-medium text-default-400 uppercase tracking-wide">Descrizione</dt>
                            <dd className="mt-1 text-sm text-default-700 whitespace-pre-wrap">{application.description || '—'}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-default-400 uppercase tracking-wide">Data creazione</dt>
                            <dd className="mt-1 text-sm text-default-700">
                                {application.created_at ? new Date(application.created_at).toLocaleDateString('it-IT') : '—'}
                            </dd>
                        </div>
                    </dl>

                    <div className="flex items-center gap-3 pt-2">
                        <Link href={route('applications.index')}>
                            <Button variant="flat" size="sm">Torna all&apos;elenco</Button>
                        </Link>
                        {isAdmin && (
                            <Link href={route('applications.edit', application.id)}>
                                <Button color="primary" size="sm">Modifica</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
