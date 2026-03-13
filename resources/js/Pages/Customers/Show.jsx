import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Button } from '@heroui/react';

export default function Show({ customer }) {
    const { auth } = usePage().props;
    const isAdmin = auth.user.role === 'admin';

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">Dettaglio Cliente</h2>
            }
        >
            <Head title="Dettaglio Cliente" />

            <div className="py-6 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
                <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6 space-y-6">
                    <h3 className="text-lg font-bold text-default-800">{customer.company_name}</h3>

                    <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <dt className="text-xs font-medium text-default-400 uppercase tracking-wide">Partita IVA</dt>
                            <dd className="mt-1 text-sm text-default-700">{customer.vat_number || '—'}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-default-400 uppercase tracking-wide">Email</dt>
                            <dd className="mt-1 text-sm text-default-700">{customer.user?.email || '—'}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-default-400 uppercase tracking-wide">Telefono</dt>
                            <dd className="mt-1 text-sm text-default-700">{customer.phone || '—'}</dd>
                        </div>
                        <div>
                            <dt className="text-xs font-medium text-default-400 uppercase tracking-wide">Indirizzo</dt>
                            <dd className="mt-1 text-sm text-default-700">{customer.address || '—'}</dd>
                        </div>
                    </dl>

                    <div className="flex items-center gap-3 pt-2">
                        <Link href={route('customers.index')}>
                            <Button variant="flat" size="sm">Torna all&apos;elenco</Button>
                        </Link>
                        {isAdmin && (
                            <Link href={route('customers.edit', customer.id)}>
                                <Button color="primary" size="sm">Modifica</Button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
