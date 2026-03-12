import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link } from '@inertiajs/react';
import { Card, CardBody, CardHeader, Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';
import { usePage } from '@inertiajs/react';

function AdminDashboard({ stats, latest_customers, latest_applications }) {
    return (
        <div className="space-y-6">
            {/* Contatori */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                <Card>
                    <CardBody className="text-center">
                        <p className="text-3xl font-bold text-blue-600">{stats.total_customers}</p>
                        <p className="mt-1 text-sm text-gray-500">Clienti totali</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className="text-center">
                        <p className="text-3xl font-bold text-green-600">{stats.open}</p>
                        <p className="mt-1 text-sm text-gray-500">Pratiche aperte</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className="text-center">
                        <p className="text-3xl font-bold text-yellow-600">{stats.in_lavorazione}</p>
                        <p className="mt-1 text-sm text-gray-500">In lavorazione</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className="text-center">
                        <p className="text-3xl font-bold text-gray-600">{stats.chiusa}</p>
                        <p className="mt-1 text-sm text-gray-500">Chiuse</p>
                    </CardBody>
                </Card>
            </div>

            {/* Ultimi 5 clienti */}
            <Card>
                <CardHeader className="flex items-center justify-between px-4 pt-4">
                    <h3 className="text-base font-semibold">Ultimi clienti</h3>
                    <Link href={route('customers.index')} className="text-sm text-blue-600 hover:underline">
                        Vedi tutti
                    </Link>
                </CardHeader>
                <CardBody>
                    <Table aria-label="Ultimi 5 clienti" removeWrapper>
                        <TableHeader>
                            <TableColumn>Ragione Sociale</TableColumn>
                            <TableColumn>Data creazione</TableColumn>
                            <TableColumn>Azioni</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {latest_customers.map((c) => (
                                <TableRow key={c.id}>
                                    <TableCell>{c.company_name}</TableCell>
                                    <TableCell>{new Date(c.created_at).toLocaleDateString('it-IT')}</TableCell>
                                    <TableCell>
                                        <Link href={route('customers.edit', c.id)} className="text-sm text-blue-600 hover:underline">
                                            Modifica
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>

            {/* Ultime 5 pratiche aperte */}
            <Card>
                <CardHeader className="flex items-center justify-between px-4 pt-4">
                    <h3 className="text-base font-semibold">Pratiche aperte recenti</h3>
                    <Link href={route('applications.index')} className="text-sm text-blue-600 hover:underline">
                        Vedi tutte
                    </Link>
                </CardHeader>
                <CardBody>
                    <Table aria-label="Ultime 5 pratiche aperte" removeWrapper>
                        <TableHeader>
                            <TableColumn>Titolo</TableColumn>
                            <TableColumn>Cliente</TableColumn>
                            <TableColumn>Data</TableColumn>
                            <TableColumn>Azioni</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {latest_applications.map((a) => (
                                <TableRow key={a.id}>
                                    <TableCell>{a.title}</TableCell>
                                    <TableCell>{a.customer?.company_name ?? '—'}</TableCell>
                                    <TableCell>{new Date(a.created_at).toLocaleDateString('it-IT')}</TableCell>
                                    <TableCell>
                                        <Link href={route('applications.edit', a.id)} className="text-sm text-blue-600 hover:underline">
                                            Modifica
                                        </Link>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>
        </div>
    );
}

const statusColor = { Aperta: 'success', 'In Lavorazione': 'warning', Chiusa: 'default' };

function CustomerDashboard({ stats, applications }) {
    return (
        <div className="space-y-6">
            {/* Contatori */}
            <div className="grid grid-cols-3 gap-4">
                <Card>
                    <CardBody className="text-center">
                        <p className="text-3xl font-bold text-green-600">{stats.open}</p>
                        <p className="mt-1 text-sm text-gray-500">Aperte</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className="text-center">
                        <p className="text-3xl font-bold text-yellow-600">{stats.in_lavorazione}</p>
                        <p className="mt-1 text-sm text-gray-500">In lavorazione</p>
                    </CardBody>
                </Card>
                <Card>
                    <CardBody className="text-center">
                        <p className="text-3xl font-bold text-gray-600">{stats.chiusa}</p>
                        <p className="mt-1 text-sm text-gray-500">Chiuse</p>
                    </CardBody>
                </Card>
            </div>

            {/* Le mie pratiche */}
            <Card>
                <CardHeader className="px-4 pt-4">
                    <h3 className="text-base font-semibold">Le mie pratiche</h3>
                </CardHeader>
                <CardBody>
                    <Table aria-label="Le mie pratiche" removeWrapper>
                        <TableHeader>
                            <TableColumn>Titolo</TableColumn>
                            <TableColumn>Stato</TableColumn>
                            <TableColumn>Data apertura</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent="Nessuna pratica.">
                            {applications.map((a) => (
                                <TableRow key={a.id}>
                                    <TableCell>{a.title}</TableCell>
                                    <TableCell>
                                        <Chip color={statusColor[a.status] ?? 'default'} size="sm" variant="flat">
                                            {a.status}
                                        </Chip>
                                    </TableCell>
                                    <TableCell>{new Date(a.created_at).toLocaleDateString('it-IT')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardBody>
            </Card>
        </div>
    );
}

export default function Dashboard({ stats, latest_customers, latest_applications, applications }) {
    const { auth } = usePage().props;
    const isAdmin = auth.user.role === 'admin';

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {isAdmin
                        ? <AdminDashboard stats={stats} latest_customers={latest_customers} latest_applications={latest_applications} />
                        : <CustomerDashboard stats={stats} applications={applications} />
                    }
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
