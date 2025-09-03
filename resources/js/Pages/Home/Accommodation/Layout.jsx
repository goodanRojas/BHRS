import { Head, Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
export default function Layout({ title, children }) {
    return (
        <AuthenticatedLayout>
            <Head title={title} />
            <div className="min-h-screen">
                <div className="p-8 space-y-6">
                    <nav className="flex space-x-2 border-b pb-3 mb-6">
                        <Link
                            href="/accommodations"
                            className={
                                route().current('accommodations.index')
                                    ? 'bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow-sm'
                                    : 'text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-md text-sm font-medium'
                            }
                        >
                            Dashboard
                        </Link>
                        <Link
                            href="/accommodations/history"
                            className={
                                route().current('accommodations.history')
                                    ? 'bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow-sm'
                                    : 'text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-md text-sm font-medium'
                            }
                        >
                            History
                        </Link>
                        <Link
                            href="/accommodations/canceled"
                            className={
                                route().current('accommodations.canceled')
                                    ? 'bg-blue-600 text-white px-3 py-1.5 rounded-md text-sm font-medium shadow-sm'
                                    : 'text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-md text-sm font-medium'
                            }
                        >
                            Canceled
                        </Link>
                    </nav>


                    <div>
                        {children}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
