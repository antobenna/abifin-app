import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Button,
    Chip,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    Select,
    SelectItem,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    useDisclosure,
} from '@heroui/react';
import { useState } from 'react';

const statusColor = { Aperta: 'success', 'In Lavorazione': 'warning', Chiusa: 'default' };
const STATUSES = ['Aperta', 'In Lavorazione', 'Chiusa'];

export default function Index({ applications, customers }) {
    const { auth } = usePage().props;
    const isAdmin = auth.user.role === 'admin';

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [toDelete, setToDelete] = useState(null);

    const rows = applications.data ?? applications;

    function confirmDelete(application) {
        setToDelete(application);
        onOpen();
    }

    function handleDelete() {
        router.delete(route('applications.destroy', toDelete.id), {
            onFinish: onClose,
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">Pratiche</h2>
                    {isAdmin && (
                        <Button as={Link} href={route('applications.create')} color="primary" size="sm">
                            Nuova Pratica
                        </Button>
                    )}
                </div>
            }
        >
            <Head title="Pratiche" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <Table aria-label="Lista pratiche">
                        <TableHeader>
                            <TableColumn>Titolo</TableColumn>
                            <TableColumn>Cliente</TableColumn>
                            <TableColumn>Stato</TableColumn>
                            <TableColumn>Data</TableColumn>
                            <TableColumn>Azioni</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent="Nessuna pratica.">
                            {rows.map((a) => (
                                <TableRow key={a.id}>
                                    <TableCell>{a.title}</TableCell>
                                    <TableCell>{a.customer?.company_name ?? '—'}</TableCell>
                                    <TableCell>
                                        <Chip color={statusColor[a.status] ?? 'default'} size="sm" variant="flat">
                                            {a.status}
                                        </Chip>
                                    </TableCell>
                                    <TableCell>{new Date(a.created_at).toLocaleDateString('it-IT')}</TableCell>
                                    <TableCell>
                                        {isAdmin && (
                                            <div className="flex gap-2">
                                                <Button
                                                    as={Link}
                                                    href={route('applications.edit', a.id)}
                                                    size="sm"
                                                    variant="flat"
                                                    color="primary"
                                                >
                                                    Modifica
                                                </Button>
                                                <Button
                                                    size="sm"
                                                    variant="flat"
                                                    color="danger"
                                                    onPress={() => confirmDelete(a)}
                                                >
                                                    Elimina
                                                </Button>
                                            </div>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Modal conferma eliminazione */}
            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalContent>
                    <ModalHeader>Conferma eliminazione</ModalHeader>
                    <ModalBody>
                        Eliminare la pratica <strong>{toDelete?.title}</strong>? L'operazione non è reversibile.
                    </ModalBody>
                    <ModalFooter>
                        <Button variant="flat" onPress={onClose}>Annulla</Button>
                        <Button color="danger" onPress={handleDelete}>Elimina</Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </AuthenticatedLayout>
    );
}
