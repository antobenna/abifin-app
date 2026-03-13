import StatCard from '@/Components/Custom/StatCard';
import DashboardLastCustomersTable from '@/Components/Dashboard/AdminDashboard/DashboardLastCustomersTable';
import DashboardLastApplicationsTable from '@/Components/Dashboard/AdminDashboard/DashboardLastApplicationsTable';

function IconCustomers() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
            <circle cx="9" cy="7" r="4" />
            <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
            <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
    );
}

function IconPending() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
        </svg>
    );
}

function IconSync() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
        </svg>
    );
}

function IconCheck() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
    );
}

export default function AdminDashboard({ stats, latest_customers, latest_applications }) {

    const dashboardStats = [
        {
            title: 'Totale Clienti',
            value: stats.total_customers,
            icon: IconCustomers,
            iconClass: 'bg-blue-100 text-blue-600'
        },
        {
            title: 'Pratiche Aperte',
            value: stats.open,
            icon: IconPending,
            iconClass: 'bg-info/20 text-info',
            chipLabel: 'Aperte',
            chipColor: 'info'
        },
        {
            title: 'In Lavorazione',
            value: stats.in_lavorazione,
            icon: IconSync,
            iconClass: 'bg-warning/20 text-warning',
            chipLabel: 'In Lavorazione',
            chipColor: 'warning'
        },
        {
            title: 'Pratiche Chiuse',
            value: stats.chiusa,
            icon: IconCheck,
            iconClass: 'bg-success/20 text-success',
            chipLabel: 'Chiuse',
            chipColor: 'success'
        },
    ];

    return (
        <div className="p-6 sm:p-8 space-y-8">
            {/* Intestazione */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
                    Dashboard Generale
                </h1>
                <p className="text-gray-500 mt-1">
                    Riepilogo delle attività recenti e dello stato delle pratiche.
                </p>
            </div>

            {/* Contatori */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {dashboardStats.map((stat, idx) => (
                    <StatCard key={idx} {...stat} />
                ))}
            </div>

            {/* Tabelle */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                <DashboardLastCustomersTable customers={latest_customers} />
                <DashboardLastApplicationsTable applications={latest_applications} />
            </div>
        </div>
    );
}
