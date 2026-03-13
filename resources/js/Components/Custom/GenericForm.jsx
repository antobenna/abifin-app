import { Link } from '@inertiajs/react';
import { Button } from '@heroui/react';

/**
 * Wrapper form con struttura grafica unificata e pulsanti Annulla/Salva.
 *
 * I campi del form vanno passati come `children`. Il pulsante "Salva" mostra
 * uno spinner quando `processing` è true.
 *
 * @param {Object}          props
 * @param {string}          [props.subtitle]   - Testo descrittivo opzionale mostrato sopra i campi.
 * @param {Function}        props.onSubmit     - Handler di submit del form.
 * @param {string}          props.cancelHref   - URL per il pulsante "Annulla".
 * @param {boolean}         props.processing   - Se true disabilita il submit e mostra lo spinner.
 * @param {React.ReactNode} props.children     - Campi del form.
 */
export default function GenericForm({ subtitle, onSubmit, cancelHref, processing, children }) {
    return (
        <div className="py-6 sm:py-12">
            <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <form onSubmit={onSubmit} className="p-4 sm:p-8">
                        {subtitle && <p className="text-sm text-gray-500 mb-6">{subtitle}</p>}
                        <div className="space-y-6">{children}</div>
                        <div className="mt-10 pt-6 border-t border-gray-100 flex items-center justify-end space-x-4">
                            <Button as={Link} href={cancelHref} variant="flat">
                                Annulla
                            </Button>
                            <Button type="submit" color="primary" isLoading={processing}>
                                Salva
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
