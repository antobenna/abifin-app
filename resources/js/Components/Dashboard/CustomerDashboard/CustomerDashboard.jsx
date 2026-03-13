import { Card, CardBody, CardHeader, Chip, Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@heroui/react';

const statusColor = { Aperta: 'success', 'In Lavorazione': 'warning', Chiusa: 'default' };

export default function CustomerDashboard({ stats, applications }) {
    return (
        <div className="p-6 sm:p-8 space-y-6">
            {/* Contatori */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
