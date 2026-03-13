import { TableRow, TableCell, Chip } from '@heroui/react';
import GenericTable from '@/Components/Custom/GenericTable';

const columns = [
    { key: 'pratica', label: 'Pratica' },
    { key: 'cliente', label: 'Cliente' },
    { key: 'stato',   label: 'Stato' },
];

const statusColor = { Aperta: 'success', 'In Lavorazione': 'warning', Chiusa: 'default' };

export default function DashboardLastApplicationsTable({ applications = [] }) {
    return (
        <GenericTable
            title="Ultime 5 Pratiche"
            seeAllHref={route('applications.index')}
            seeAllLabel="Gestisci tutto"
            columns={columns}
            emptyContent="Nessuna pratica."
        >
            {applications.map((a) => (
                <TableRow key={a.id}>
                    <TableCell>
                        <p className="text-sm font-bold text-primary">#{a.id}</p>
                        <p className="text-xs text-default-500">{a.title}</p>
                    </TableCell>
                    <TableCell className="text-sm text-default-500">{a.customer?.company_name}</TableCell>
                    <TableCell>
                        <Chip color={statusColor[a.status] ?? 'default'} size="sm" variant="flat">{a.status}</Chip>
                    </TableCell>
                </TableRow>
            ))}
        </GenericTable>
    );
}
