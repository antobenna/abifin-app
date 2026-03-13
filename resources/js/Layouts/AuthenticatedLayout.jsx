import { Link, usePage } from '@inertiajs/react';
import { useState } from 'react';

function IconDashboard() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
        </svg>
    );
}

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

function IconFiles() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14 2 14 8 20 8" />
            <line x1="16" y1="13" x2="8" y2="13" />
            <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
    );
}

function IconMenu() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
    );
}

const avatarColors = [
    'bg-blue-100 text-blue-600',
    'bg-purple-100 text-purple-600',
    'bg-green-100 text-green-600',
    'bg-orange-100 text-orange-600',
];

function SidebarContent({ user, onLinkClick }) {
    const isAdmin = user.role === 'admin';

    const links = isAdmin
        ? [
              { href: route('dashboard'), label: 'Dashboard', icon: <IconDashboard />, routePattern: 'dashboard' },
              { href: route('customers.index'), label: 'Clienti', icon: <IconCustomers />, routePattern: 'customers.*' },
              { href: route('applications.index'), label: 'Pratiche', icon: <IconFiles />, routePattern: 'applications.*' },
          ]
        : [
              { href: route('dashboard'), label: 'Dashboard', icon: <IconDashboard />, routePattern: 'dashboard' },
              { href: route('applications.index'), label: 'Pratiche', icon: <IconFiles />, routePattern: 'applications.*' },
          ];

    // Initials avatar color based on name
    const colorClass = avatarColors[user.name.charCodeAt(0) % avatarColors.length];
    const initials = user.name
        .split(' ')
        .slice(0, 2)
        .map((w) => w[0])
        .join('')
        .toUpperCase();

    return (
        <>
            {/* Logo */}
            <div className="p-6 flex items-center gap-3 flex-shrink-0">
                <div className="bg-primary size-8 rounded-lg flex items-center justify-center text-white flex-shrink-0">
                    <IconDashboard />
                </div>
                <span className="font-bold text-xl tracking-tight">
                    Abi<span className="text-primary">Fin</span>
                </span>
            </div>

            {/* Nav links */}
            <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
                {links.map((link) => {
                    const isActive = route().current(link.routePattern);
                    return (
                        <Link
                            key={link.label}
                            href={link.href}
                            onClick={onLinkClick}
                            className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                                isActive
                                    ? 'bg-primary/10 text-primary font-semibold'
                                    : 'text-gray-500 hover:bg-gray-100'
                            }`}
                        >
                            {link.icon}
                            {link.label}
                        </Link>
                    );
                })}
            </nav>

            {/* User footer */}
            <div className="p-4 border-t border-gray-200 flex-shrink-0">
                <div className="flex items-center gap-3 px-2 py-1">
                    <div className={`size-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0 ${colorClass}`}>
                        {initials}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold truncate">{user.name}</p>
                        <p className="text-xs text-gray-500 truncate">
                            {user.role === 'admin' ? 'Amministratore' : 'Cliente'}
                        </p>
                    </div>
                </div>
                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="mt-2 w-full text-left px-3 py-2 text-sm text-gray-500 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    Esci
                </Link>
            </div>
        </>
    );
}

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Desktop sidebar */}
            <aside className="w-64 flex-shrink-0 border-r border-gray-200 bg-white hidden md:flex flex-col">
                <SidebarContent user={user} />
            </aside>

            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <>
                    <div
                        className="fixed inset-0 z-20 bg-black/40 md:hidden"
                        onClick={() => setSidebarOpen(false)}
                    />
                    <aside className="fixed inset-y-0 left-0 z-30 w-64 bg-white flex flex-col md:hidden shadow-xl">
                        <SidebarContent user={user} onLinkClick={() => setSidebarOpen(false)} />
                    </aside>
                </>
            )}

            {/* Main area */}
            <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                {/* Sticky header */}
                <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 px-6 py-4 flex items-center gap-4">
                    <button
                        className="md:hidden p-1 rounded-lg text-gray-500 hover:bg-gray-100 flex-shrink-0"
                        onClick={() => setSidebarOpen(true)}
                        aria-label="Apri menu"
                    >
                        <IconMenu />
                    </button>
                    <div className="flex-1 min-w-0">{header}</div>
                </header>

                <main className="flex-1 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
