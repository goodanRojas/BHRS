import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import NavLink from '@/Components/NavLink';
export default function Layout({ title, children }) {
    return (
        <AuthenticatedLayout>
            <Head title={title} />
            <div className="min-h-screen bg-gray-100">
                <div className="p-8 space-y-6">
                    <nav className="flex space-x-4 border-b pb-4 mb-6">
                        <NavLink href="/accommodations" active={route().current('accommodations.index')}>Dashboard</NavLink>
                        <NavLink href="/accommodations/history" active={route().current('accommodations.history')} >History</NavLink>
                        <NavLink href="/accommodations/ratings" active={route().current('accommodations.ratings')} >Feedback</NavLink>
                     </nav>

                    <div className="bg-white p-6 rounded-lg shadow-md">
                        {children}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
