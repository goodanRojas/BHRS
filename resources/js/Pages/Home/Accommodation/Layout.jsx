import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import NavLink from '@/Components/NavLink';
export default function Layout({ title, children }) {
    return (
        <AuthenticatedLayout>
            <Head title={title} />
            <div className="min-h-screen">
                <div className="p-8 space-y-6">
                    <nav className="flex space-x-4 border-b pb-4 mb-6">
                        <NavLink href="/accommodations" active={route().current('accommodations.index')}>Dashboard</NavLink>
                        <NavLink href="/accommodations/history" active={route().current('accommodations.history')} >History</NavLink>
                     </nav>

                    <div>
                        {children}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
