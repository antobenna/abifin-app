import { TableRow, TableCell, Chip } from '@heroui/react';
import { Link } from '@inertiajs/react';
import GenericTable from '@/Components/Custom/GenericTable';

const statusColor = { Aperta: 'success', 'In Lavorazione': 'warning', Chiusa: 'default' };

/**
 * Tabella di gestione pratiche con colonne dinamiche in base al ruolo.
 *
 * Se `isAdmin` è true aggiunge la colonna Cliente e mostra i pulsanti Modifica ed Elimina.
 * Accetta sia un oggetto paginato Laravel (con `.data`) che un array semplice.
 *
 * @param {Object|Array} props.applications - Risposta paginata Laravel o array di pratiche.
 * @param {boolean}      props.isAdmin      - Se true aggiunge colonna Cliente e azioni admin.
 * @param {Function}     [props.onDelete]   - Callback invocata con la pratica selezionata per l'eliminazione.
 */
export default function ApplicationsManagementTable({ applications, isAdmin, onDelete }) {
    const rows = applications.data ?? applications;
    const pagination = applications.data ? applications : undefined;

    const dynamicColumns = [
        { key: 'titolo',  label: 'Titolo' },
        ...(isAdmin ? [{ key: 'cliente', label: 'Cliente' }] : []),
        { key: 'stato',   label: 'Stato' },
        { key: 'data',    label: 'Data' },
        { key: 'azioni',  label: 'Azioni' },
    ];

    // Funzione helper per renderizzare il contenuto delle celle
    const renderCell = (item, columnKey) => {
        switch (columnKey) {
            case 'titolo':
                return (
                    <>
                        <p className="text-sm font-bold text-primary">#{item.id}</p>
                        <p className="text-xs text-default-500">{item.title}</p>
                    </>
                );
            case 'cliente':
                return <span className="text-sm text-default-500">{item.customer?.company_name ?? '—'}</span>;
            case 'stato':
                return (
                    <Chip color={statusColor[item.status] ?? 'default'} size="sm" variant="flat">
                        {item.status}
                    </Chip>
                );
            case 'data':
                return (
                    <span className="text-sm text-default-500">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString('it-IT') : '—'}
                    </span>
                );
            case 'azioni':
                return (
                    <div className="flex items-center gap-1">
                        <Link href={route('applications.show', item.id)} className="p-2 text-default-400 hover:text-primary transition-colors rounded-lg" title="Visualizza">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-1.274 4.057-5.065 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        </Link>
                        {isAdmin && (
                            <>
                                <Link href={route('applications.edit', item.id)} className="p-2 text-default-400 hover:text-primary transition-colors rounded-lg" title="Modifica">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                    </svg>
                                </Link>
                                <button onClick={() => onDelete(item)} className="p-2 text-default-400 hover:text-danger transition-colors rounded-lg" title="Elimina">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <GenericTable
            columns={dynamicColumns}
            emptyContent="Nessuna pratica."
            pagination={pagination}
        >
            {rows.map((item) => (
                <TableRow key={item.id}>
                    {dynamicColumns.map((column) => (
                        <TableCell key={column.key}>
                            {renderCell(item, column.key)}
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </GenericTable>
    );
}