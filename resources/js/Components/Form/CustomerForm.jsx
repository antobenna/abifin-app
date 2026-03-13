import CustomInput from '@/Components/Custom/CustomInput';
import GenericForm from '@/Components/Custom/GenericForm';

/**
 * Form riutilizzabile per la creazione e la modifica di un cliente.
 *
 * Campi: Ragione Sociale, P.IVA, Indirizzo, Telefono, Email.
 * Delega la struttura grafica a `GenericForm`.
 *
 * @param {Object}   props
 * @param {Object}   props.data          - Valori correnti del form (company_name, vat_number, address, phone, email).
 * @param {Function} props.setData       - Setter di Inertia useForm per aggiornare i campi.
 * @param {Object}   props.errors        - Errori di validazione restituiti dal server.
 * @param {Function} props.onSubmit      - Handler di submit del form.
 * @param {string}   props.cancelHref    - URL per il pulsante "Annulla".
 * @param {boolean}  props.processing    - Stato di caricamento del form (disabilita il submit).
 * @param {string}   [props.subtitle]    - Testo descrittivo opzionale mostrato sopra i campi.
 */
export default function CustomerForm({ data, setData, errors, onSubmit, cancelHref, processing, subtitle }) {
    return (
        <GenericForm onSubmit={onSubmit} cancelHref={cancelHref} processing={processing} subtitle={subtitle}>
            <CustomInput
                label="Ragione Sociale"
                value={data.company_name}
                onValueChange={(v) => setData('company_name', v)}
                isInvalid={!!errors.company_name}
                errorMessage={errors.company_name}
                isRequired
            />
            <CustomInput
                label="P.IVA"
                value={data.vat_number}
                onValueChange={(v) => setData('vat_number', v)}
                isInvalid={!!errors.vat_number}
                errorMessage={errors.vat_number}
                isRequired
            />
            <CustomInput
                label="Indirizzo"
                value={data.address}
                onValueChange={(v) => setData('address', v)}
                isInvalid={!!errors.address}
                errorMessage={errors.address}
                isRequired
            />
            <CustomInput
                label="Telefono"
                value={data.phone}
                onValueChange={(v) => setData('phone', v)}
                isInvalid={!!errors.phone}
                errorMessage={errors.phone}
                isRequired
            />
            <CustomInput
                label="Email"
                type="email"
                value={data.email}
                onValueChange={(v) => setData('email', v)}
                isInvalid={!!errors.email}
                errorMessage={errors.email}
                isRequired
            />
        </GenericForm>
    );
}
