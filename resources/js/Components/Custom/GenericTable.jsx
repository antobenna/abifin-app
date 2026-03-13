import { Card, Table, TableBody, TableColumn, TableHeader } from '@heroui/react';
import { Link } from '@inertiajs/react';

/**
 * Wrapper tabella riutilizzabile con intestazione opzionale e paginazione Laravel.
 *
 * Gestisce automaticamente i link prev/next/page dalla risposta paginata di Laravel.
 * I contenuti delle righe vanno passati come `children` (TableRow).
 *
 * @param {Object}   props
 * @param {string}   [props.title]           - Titolo mostrato nell'intestazione della card.
 * @param {string}   [props.seeAllHref]      - URL per il link "Vedi tutti".
 * @param {string}   [props.seeAllLabel]     - Etichetta del link "Vedi tutti" (default: 'Vedi tutti').
 * @param {Array}    props.columns           - Definizione colonne: array di { key, label }.
 * @param {string}   [props.emptyContent]    - Testo mostrato se non ci sono righe.
 * @param {Object}   [props.pagination]      - Oggetto paginazione Laravel (links, from, to, total, last_page).
 * @param {React.ReactNode} props.children   - Righe della tabella (TableRow).
 */
export default function GenericTable({
    title,
    seeAllHref,
    seeAllLabel = 'Vedi tutti',
    columns,
    emptyContent = 'Nessun elemento.',
    pagination,
    children,
}) {
    const prevLink = pagination?.links?.[0];
    const nextLink = pagination ? pagination.links[pagination.links.length - 1] : null;
    const pageLinks = pagination?.links?.slice(1, -1) ?? [];

    return (
        <Card className="border border-divider shadow-sm overflow-hidden">
            {(title || seeAllHref) && (
                <div className="px-6 py-4 border-b border-divider flex justify-between items-center">
                    {title && <h3 className="font-bold text-foreground">{title}</h3>}
                    {seeAllHref && (
                        <Link
                            href={seeAllHref}
                            className="text-primary text-sm font-semibold hover:underline ml-auto"
                        >
                            {seeAllLabel}
                        </Link>
                    )}
                </div>
            )}
            <div className="overflow-x-auto">
            <Table removeWrapper aria-label={title ?? 'Tabella'}>
                <TableHeader>
                    {columns.map((col) => (
                        <TableColumn key={col.key}>{col.label}</TableColumn>
                    ))}
                </TableHeader>
                <TableBody emptyContent={emptyContent}>{children}</TableBody>
            </Table>
            </div>
            {pagination && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-6 py-4 border-t border-divider">
                    <span className="text-xs text-default-500 font-medium">
                        {pagination.from != null
                            ? `Mostrando ${pagination.from} a ${pagination.to} di ${pagination.total} elementi`
                            : 'Nessun elemento'}
                    </span>
                    {pagination.last_page > 1 && (
                        <div className="flex items-center gap-1">
                            {prevLink?.url ? (
                                <Link
                                    href={prevLink.url}
                                    preserveScroll
                                    className="size-9 flex items-center justify-center rounded-lg border border-divider text-default-400 hover:bg-default-100"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </Link>
                            ) : (
                                <span className="size-9 flex items-center justify-center rounded-lg border border-divider text-default-300 cursor-not-allowed">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </span>
                            )}
                            {pageLinks.map((link, i) =>
                                link.url ? (
                                    <Link
                                        key={i}
                                        href={link.url}
                                        preserveScroll
                                        className={`size-9 hidden sm:flex items-center justify-center rounded-lg text-xs font-bold transition-colors ${
                                            link.active
                                                ? 'bg-primary text-white'
                                                : 'text-default-600 hover:bg-default-100'
                                        }`}
                                    >
                                        {link.label}
                                    </Link>
                                ) : (
                                    <span key={i} className="size-9 hidden sm:flex items-center justify-center text-xs text-default-400">
                                        {link.label}
                                    </span>
                                )
                            )}
                            {nextLink?.url ? (
                                <Link
                                    href={nextLink.url}
                                    preserveScroll
                                    className="size-9 flex items-center justify-center rounded-lg border border-divider text-default-400 hover:bg-default-100"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </Link>
                            ) : (
                                <span className="size-9 flex items-center justify-center rounded-lg border border-divider text-default-300 cursor-not-allowed">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </span>
                            )}
                        </div>
                    )}
                </div>
            )}
        </Card>
    );
}
