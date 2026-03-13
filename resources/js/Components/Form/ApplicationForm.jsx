import CustomInput from '@/Components/Custom/CustomInput';
import CustomTextarea from '@/Components/Custom/CustomTextarea';
import CustomSelect from '@/Components/Custom/CustomSelect';
import GenericForm from '@/Components/Custom/GenericForm';

const STATUSES = ['Aperta', 'In Lavorazione', 'Chiusa'];

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
