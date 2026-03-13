import { TableRow, TableCell, Chip } from '@heroui/react';
import { Link } from '@inertiajs/react';
import GenericTable from '@/Components/Custom/GenericTable';

const columns = [
    { key: 'titolo',  label: 'Titolo' },
    { key: 'cliente', label: 'Cliente' },
    { key: 'stato',   label: 'Stato' },
    { key: 'data',    label: 'Data' },
    { key: 'azioni',  label: 'Azioni' },
];

const statusColor = { Aperta: 'success', 'In Lavorazione': 'warning', Chiusa: 'default' };

export default function ApplicationsManagementTable({ applications, isAdmin, onDelete }) {
    const rows = applications.data ?? applications;
    const pagination = applications.data ? applications : undefined;

    return (
        <GenericTable
            columns={columns}
            emptyContent="Nessuna pratica."
            pagination={pagination}
        >
            {rows.map((a) => (
                <TableRow key={a.id}>
                    <TableCell>
                        <p className="text-sm font-bold text-primary">#{a.id}</p>
                        <p className="text-xs text-default-500">{a.title}</p>
                    </TableCell>
                    <TableCell className="text-sm text-default-500">{a.customer?.company_name ?? '—'}</TableCell>
                    <TableCell>
                        <Chip color={statusColor[a.status] ?? 'default'} size="sm" variant="flat">{a.status}</Chip>
                    </TableCell>
                    <TableCell className="text-sm text-default-500">
                        {a.created_at ? new Date(a.created_at).toLocaleDateString('it-IT') : '—'}
                    </TableCell>
                    <TableCell>
                        <div className="flex items-center gap-1">
                            <Link href={route('applications.show', a.id)} className="p-2 text-default-400 hover:text-primary transition-colors rounded" title="Visualizza">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                            </Link>
                            {isAdmin && (
                                <>
                                    <Link href={route('applications.edit', a.id)} className="p-2 text-default-400 hover:text-primary transition-colors rounded" title="Modifica">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </Link>
                                    <button onClick={() => onDelete(a)} className="p-2 text-default-400 hover:text-danger transition-colors rounded" title="Elimina">
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
