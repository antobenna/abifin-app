import AdminDashboard from '@/Components/Dashboard/AdminDashboard/AdminDashboard';
import CustomerDashboard from '@/Components/Dashboard/CustomerDashboard/CustomerDashboard';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';

/**
 * Pagina dashboard principale.
 *
 * Legge il ruolo dell'utente autenticato e smista il rendering verso
 * `AdminDashboard` (admin) o `CustomerDashboard` (cliente).
 *
 * @param {Object} props
 * @param {Object} props.stats               - Contatori delle pratiche per stato (e totale clienti per admin).
 * @param {Array}  [props.latest_customers]  - Ultimi 5 clienti registrati (solo admin).
 * @param {Array}  [props.latest_applications] - Ultime 5 pratiche create (solo admin).
 * @param {Array}  [props.applications]      - Elenco delle pratiche del cliente autenticato (solo cliente).
 */
export default function Dashboard({ stats, latest_customers, latest_applications, applications }) {
    const { auth } = usePage().props;
    const isAdmin = auth.user.role === 'admin';

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800">Dashboard</h2>
            }
        >
            <Head title="Dashboard" />

            {isAdmin
                ? <AdminDashboard stats={stats} latest_customers={latest_customers} latest_applications={latest_applications} />
                : <CustomerDashboard stats={stats} applications={applications} />
            }
        </AuthenticatedLayout>
    );
}
