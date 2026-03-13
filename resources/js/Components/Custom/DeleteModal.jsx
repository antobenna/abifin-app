import { Button, Modal, ModalContent, useDisclosure } from '@heroui/react';

/**
 * Modale di conferma eliminazione.
 *
 * Supporta sia clienti che pratiche: la prop `isApplication` determina il genere
 * della frase mostrata all'utente ("il cliente" / "la pratica").
 * L'operazione viene confermata solo al clic di "Elimina Definitivamente".
 *
 * @param {Object}   props
 * @param {boolean}  props.isOpen         - Controlla la visibilità della modale.
 * @param {Function} props.onClose        - Callback invocata alla chiusura (Annulla o overlay).
 * @param {Function} props.onConfirm      - Callback invocata alla conferma eliminazione.
 * @param {boolean}  props.isApplication  - Se true usa il genere femminile ("la pratica").
 * @param {string}   props.name           - Nome dell'elemento da eliminare (mostrato in grassetto).
 */
export default function DeleteModal({ isOpen, onClose, onConfirm, isApplication, name }) {
    const noun = isApplication ? 'la pratica' : 'il cliente';

    return (
        <Modal isOpen={isOpen} onClose={onClose} backdrop="blur" placement="center"
            hideCloseButton
            classNames={{
                wrapper: "z-[100]",
                backdrop: "bg-overlay/60 backdrop-blur-sm",
                base: "bg-content1 border border-divider shadow-2xl rounded-xl overflow-hidden max-w-md w-full m-4",
            }}>
            <ModalContent>
                <div className="p-6">
                    <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-danger/10 flex items-center justify-center text-danger shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-foreground">Conferma eliminazione</h3>
                    </div>
                    <p className="text-default-500 leading-relaxed mb-6">
                        Sei sicuro di voler eliminare {noun} <span className="font-bold text-foreground">"{name}"</span>? L'operazione è irreversibile.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Button className="flex-1" variant="flat" onPress={onClose}>
                            Annulla
                        </Button>
                        <Button className="flex-1 font-semibold rounded-lg shadow-lg shadow-danger/40" variant="solid" color="danger" onPress={onConfirm}>
                            Elimina Definitivamente
                        </Button>
                    </div>
                </div>
            </ModalContent>
        </Modal>
    );
}
