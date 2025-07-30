import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
export default function Layout({ title, children }) {
    return (
        <AuthenticatedLayout>
            <Head title={title} />
            <div className="min-h-screen">
                <div className="p-8 space-y-6">
                    <nav className="flex space-x-4 border-b pb-4 mb-6">
                        <Link
                            href="/accommodations"
                            className={
                                route().current('accommodations.index')
                                    ? 'bg-blue-600 text-white px-4 py-2 rounded'
                                    : 'text-blue-600 hover:bg-blue-100 px-4 py-2 rounded'
                            }
                        >Dashboard</Link>
                        <Link className={
                            route().current('accommodations.history')
                                ? 'bg-blue-600 text-white px-4 py-2 rounded'
                                : 'text-blue-600 hover:bg-blue-100 px-4 py-2 rounded'
                        } href="/accommodations/history" >History</Link>
                        <Link className={
                            route().current('accommodations.canceled')
                                ? 'bg-blue-600 text-white px-4 py-2 rounded'
                                : 'text-blue-600 hover:bg-blue-100 px-4 py-2 rounded'
                        } href="/accommodations/cancelled">Cancelled</Link>
                    </nav>

                    <div>
                        {children}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
