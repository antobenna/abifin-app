import CustomInput from '@/Components/Custom/CustomInput';
import CustomTextarea from '@/Components/Custom/CustomTextarea';
import CustomSelect from '@/Components/Custom/CustomSelect';
import GenericForm from '@/Components/Custom/GenericForm';

const STATUSES = ['Aperta', 'In Lavorazione', 'Chiusa'];

/**
 * Form riutilizzabile per la creazione e la modifica di una pratica.
 *
 * Campi sempre presenti: Titolo, Descrizione, Stato.
 * Il campo Cliente (select) viene mostrato solo se `isAdmin` è true.
 * I valori ammessi per lo stato sono: 'Aperta', 'In Lavorazione', 'Chiusa'.
 *
 * @param {Object}   props
 * @param {Object}   props.data          - Valori correnti del form (title, description, status, customer_id).
 * @param {Function} props.setData       - Setter di Inertia useForm.
 * @param {Object}   props.errors        - Errori di validazione restituiti dal server.
 * @param {Function} props.onSubmit      - Handler di submit del form.
 * @param {string}   props.cancelHref    - URL per il pulsante "Annulla".
 * @param {boolean}  props.processing    - Stato di caricamento del form.
 * @param {Array}    props.customers     - Lista clienti per la select (id, company_name).
 * @param {boolean}  props.isAdmin       - Se true mostra la select del cliente.
 * @param {string}   [props.subtitle]    - Testo descrittivo opzionale.
 */
export default function ApplicationForm({ data, setData, errors, onSubmit, cancelHref, processing, customers, isAdmin, subtitle }) {
    return (
        <GenericForm onSubmit={onSubmit} cancelHref={cancelHref} processing={processing} subtitle={subtitle}>
            <CustomInput
                label="Titolo"
                value={data.title}
                onValueChange={(v) => setData('title', v)}
                isInvalid={!!errors.title}
                errorMessage={errors.title}
                isRequired
            />
            <CustomTextarea
                label="Descrizione"
                value={data.description}
                onValueChange={(v) => setData('description', v)}
                isInvalid={!!errors.description}
                errorMessage={errors.description}
            />
            <CustomSelect
                label="Stato"
                value={data.status}
                onValueChange={(v) => setData('status', v)}
                isInvalid={!!errors.status}
                errorMessage={errors.status}
                isRequired
                options={STATUSES.map((s) => ({ key: s, label: s }))}
            />
            {isAdmin && (
                <CustomSelect
                    label="Cliente"
                    value={data.customer_id ? String(data.customer_id) : ''}
                    onValueChange={(v) => setData('customer_id', Number(v))}
                    isInvalid={!!errors.customer_id}
                    errorMessage={errors.customer_id}
                    isRequired
                    options={customers.map((c) => ({ key: String(c.id), label: c.company_name }))}
                />
            )}
        </GenericForm>
    );
}
