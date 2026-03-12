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
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    useDisclosure,
} from '@heroui/react';
import { useState } from 'react';

export default function Index({ customers }) {
    const { auth, errors } = usePage().props;
    const isAdmin = auth.user.role === 'admin';

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [toDelete, setToDelete] = useState(null);

    const rows = customers.data ?? customers;

    function confirmDelete(customer) {
        setToDelete(customer);
        onOpen();
    }

    function handleDelete() {
        router.delete(route('customers.destroy', toDelete.id), {
            onFinish: onClose,
        });
    }

    return (
        <AuthenticatedLayout
            header={
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800">Clienti</h2>
                    {isAdmin && (
                        <Button as={Link} href={route('customers.create')} color="primary" size="sm">
                            Nuovo Cliente
                        </Button>
                    )}
                </div>
            }
        >
            <Head title="Clienti" />

            <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {errors.delete && (
                        <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
                            {errors.delete}
                        </div>
                    )}

                    <Table aria-label="Lista clienti">
                        <TableHeader>
                            <TableColumn>Ragione Sociale</TableColumn>
                            <TableColumn>P.IVA</TableColumn>
                            <TableColumn>Telefono</TableColumn>
                            <TableColumn>Indirizzo</TableColumn>
                            <TableColumn>Azioni</TableColumn>
                        </TableHeader>
                        <TableBody emptyContent="Nessun cliente.">
                            {rows.map((c) => (
                                <TableRow key={c.id}>
                                    <TableCell>{c.company_name}</TableCell>
                                    <TableCell>{c.vat_number}</TableCell>
                                    <TableCell>{c.phone}</TableCell>
                                    <TableCell>{c.address}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            {isAdmin && (
                                                <>
                                                    <Button
                                                        as={Link}
                                                        href={route('customers.edit', c.id)}
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
                                                        onPress={() => confirmDelete(c)}
                                                    >
                                                        Elimina
                                                    </Button>
                                                </>
                                            )}
                                        </div>
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
                        Eliminare il cliente <strong>{toDelete?.company_name}</strong>? L'operazione non è reversibile.
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
