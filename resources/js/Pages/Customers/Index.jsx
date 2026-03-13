import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import CustomersManagementTable from '@/Components/ManagementTables/CustomersManagementTable';
import { Head, Link, router, usePage } from '@inertiajs/react';
import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
    useDisclosure,
} from '@heroui/react';
import { useState } from 'react';

export default function Index({ customers }) {
    const { auth, errors } = usePage().props;
    const isAdmin = auth.user.role === 'admin';

    const { isOpen, onOpen, onClose } = useDisclosure();
    const [toDelete, setToDelete] = useState(null);

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
                <h2 className="text-xl font-semibold leading-tight text-gray-800">Clienti</h2>
            }
        >
            <Head title="Clienti" />

            <div className="py-8">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    {/* Page header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6">
                        <div>
                            <h1 className="text-3xl font-black text-foreground leading-tight">Gestione Clienti</h1>
                            <p className="text-default-500 text-sm mt-1 max-w-xl">
                                Monitora, modifica e gestisci il database dei tuoi clienti registrati.
                            </p>
                        </div>
                        {isAdmin && (
                            <Button as={Link} href={route('customers.create')} color="primary">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                Nuovo Cliente
                            </Button>
                        )}
                    </div>

                    {errors.delete && (
                        <div className="mb-4 rounded bg-red-100 p-3 text-sm text-red-700">
                            {errors.delete}
                        </div>
                    )}

                    <CustomersManagementTable
                        customers={customers}
                        isAdmin={isAdmin}
                        onDelete={confirmDelete}
                    />
                </div>
            </div>

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
