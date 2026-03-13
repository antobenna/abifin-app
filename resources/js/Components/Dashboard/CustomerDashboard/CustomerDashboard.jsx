import StatCard from '@/Components/Custom/StatCard';
import ApplicationsManagementTable from '@/Components/ManagementTables/ApplicationsManagementTable';

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

export default function CustomerDashboard({ stats, applications }) {
    const dashboardStats = [
        {
            title: 'Pratiche Aperte',
            value: stats.open,
            icon: IconPending,
            iconClass: 'bg-info/20 text-info',
            chipLabel: 'Aperte',
            chipColor: 'info',
        },
        {
            title: 'Pratiche In Lavorazione',
            value: stats.in_lavorazione,
            icon: IconSync,
            iconClass: 'bg-warning/20 text-warning',
            chipLabel: 'In Lavorazione',
            chipColor: 'warning',
        },
        {
            title: 'Pratiche Chiuse',
            value: stats.chiusa,
            icon: IconCheck,
            iconClass: 'bg-success/20 text-success',
            chipLabel: 'Chiuse',
            chipColor: 'success',
        },
    ];

    return (
        <div className="p-6 sm:p-8 space-y-8">
            {/* Intestazione */}
            <div>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">
                    La mia area
                </h1>
                <p className="text-gray-500 mt-1">
                    Riepilogo delle tue pratiche e del loro stato attuale.
                </p>
            </div>

            {/* Contatori */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {dashboardStats.map((stat, idx) => (
                    <StatCard key={idx} {...stat} />
                ))}
            </div>

            {/* Tabella pratiche */}
            <ApplicationsManagementTable applications={applications} isAdmin={false} />
        </div>
    );
}
