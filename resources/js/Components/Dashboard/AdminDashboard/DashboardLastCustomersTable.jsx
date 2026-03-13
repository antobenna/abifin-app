import { TableRow, TableCell } from '@heroui/react';
import GenericTable from '@/Components/Custom/GenericTable';

const columns = [
    { key: 'cliente', label: 'Cliente' },
    { key: 'email',   label: 'Email' },
    { key: 'data',    label: 'Data Reg.' },
];

const avatarColors = [
    'bg-blue-100 text-blue-600',
    'bg-purple-100 text-purple-600',
    'bg-green-100 text-green-600',
    'bg-orange-100 text-orange-600',
    'bg-red-100 text-red-600',
];

export default function DashboardLastCustomersTable({ customers = [] }) {
    return (
        <GenericTable
            title="Ultimi 5 Clienti"
            seeAllHref={route('customers.index')}
            columns={columns}
            emptyContent="Nessun cliente."
        >
            {customers.map((c, i) => (
                <TableRow key={c.id}>
                    <TableCell>
                        <div className="flex items-center gap-3">
                            <div className={`size-8 rounded-full flex items-center justify-center font-bold text-xs flex-shrink-0 ${avatarColors[i % avatarColors.length]}`}>
                                {c.company_name ? c.company_name.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase() : '?'}
                            </div>
                            <span className="text-sm font-medium">{c.company_name}</span>
                        </div>
                    </TableCell>
                    <TableCell className="text-sm text-default-500">{c.user?.email}</TableCell>
                    <TableCell className="text-sm text-default-500">
                        {c.created_at ? new Date(c.created_at).toLocaleDateString('it-IT') : '—'}
                    </TableCell>
                </TableRow>
            ))}
        </GenericTable>
    );
}
