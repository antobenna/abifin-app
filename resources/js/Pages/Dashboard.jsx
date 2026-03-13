import AdminDashboard from '@/Components/Dashboard/AdminDashboard';
import CustomerDashboard from '@/Components/Dashboard/CustomerDashboard';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { usePage } from '@inertiajs/react';

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
