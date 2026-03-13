import { TableRow, TableCell } from '@heroui/react';
import { Link } from '@inertiajs/react';
import GenericTable from '@/Components/Custom/GenericTable';

const columns = [
    { key: 'cliente',   label: 'Ragione Sociale' },
    { key: 'email',     label: 'Email' },
    { key: 'piva',      label: 'P.IVA' },
    { key: 'telefono',  label: 'Telefono' },
    { key: 'indirizzo', label: 'Indirizzo' },
    { key: 'azioni',    label: 'Azioni' },
];

const avatarColors = [
    'bg-blue-100 text-blue-600',
    'bg-purple-100 text-purple-600',
    'bg-green-100 text-green-600',
    'bg-orange-100 text-orange-600',
    'bg-red-100 text-red-600',
];

export default function CustomersManagementTable({ customers, isAdmin, onDelete }) {
    const rows = customers.data ?? customers;
    const pagination = customers.data ? customers : undefined;

    return (
        <GenericTable
            columns={columns}
            emptyContent="Nessun cliente."
            pagination={pagination}
        >
            {rows.map((c, i) => (
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
                    <TableCell className="text-sm text-default-500">{c.vat_number}</TableCell>
                    <TableCell className="text-sm text-default-500">{c.phone}</TableCell>
                    <TableCell className="text-sm text-default-500">{c.address}</TableCell>
                    <TableCell>
                        <div className="flex items-center gap-1">
                            <Link href={route('customers.show', c.id)} className="p-2 text-default-400 hover:text-primary transition-colors rounded-lg" title="Visualizza">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </Link>
                            {isAdmin && (
                                <>
                                    <Link href={route('customers.edit', c.id)} className="p-2 text-default-400 hover:text-primary transition-colors rounded-lg" title="Modifica">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </Link>
                                    <button onClick={() => onDelete(c)} className="p-2 text-default-400 hover:text-danger transition-colors rounded-lg" title="Elimina">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </>
                            )}
                        </div>
                    </TableCell>
                </TableRow>
            ))}
        </GenericTable>
    );
}
