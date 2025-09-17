import { useEffect, useState } from "react";
import AuthenticatedLayout from "../../AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
import Toast from "@/Components/Toast";
export default function BuildingApplication({ applications: initialApplications }) {

    const { flash } = usePage().props;
    const admin = usePage().props.auth.user;
    useEffect(() => {
        if (flash?.success) {
            setToast({ show: true, message: flash.success, type: 'success' });
        }
    }, [flash?.success]);
    const [applications, setApplications] = useState(initialApplications);
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });
    useEffect(() => {
        const channel = window.Echo.private(`admin-new-building-app.${admin?.id}`)

            .listen('.ToAdminNewBuildingAppEvent', (e) => {
                console.log('🔔 New booking approved received!', e);
                setApplications((prev) => [e.application, ...prev]);
            });

        return () => {
            channel.stopListening('.ToAdminNewBuildingAppEvent');
            window.Echo.leave(`private-admin-new-building-app.${admin.id}`);
        };
    }, [admin?.id]);

    return (
        <AuthenticatedLayout>
            <Head title="Building Applications" />
            <Toast message={toast.message} isTrue={toast.show} isType={toast.type} id={Date.now()} />
            <div className="p-6">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">
                    Building Applications
                </h1>

                {applications.length === 0 ? (
                    <p className="text-gray-500 text-center py-10 bg-white rounded-lg shadow">
                        No applications submitted yet.
                    </p>
                ) : (
                    <div className="overflow-x-auto bg-white shadow-md rounded-xl">
                        <table className="min-w-[600px] w-full text-sm text-left text-gray-700">       <thead className="bg-gray-50 text-gray-600 uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-3">Owner</th>
                                <th className="px-6 py-3">Building Name</th>
                                <th className="px-6 py-3">Floors</th>
                                <th className="px-6 py-3">Rooms</th>
                                <th className="px-6 py-3">Submitted</th>
                            </tr>
                        </thead>
                            <tbody className="divide-y divide-gray-100">
                                {applications.map((app) => (
                                    <tr
                                        key={app.id}
                                        onClick={() =>
                                            (window.location.href = `/admin/owner/building/application/show/${app.id}`)
                                        }
                                        className="hover:bg-indigo-50 cursor-pointer transition-colors"
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900 truncate">
                                            {app.seller?.name ?? "N/A"}
                                        </td>
                                        <td className="px-6 py-4 truncate">{app.name}</td>
                                        <td className="px-6 py-4">{app.number_of_floors}</td>
                                        <td className="px-6 py-4">{app.number_of_rooms}</td>
                                        <td className="px-6 py-4 text-gray-600 truncate">
                                            {new Date(app.created_at).toLocaleDateString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                            })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

        </AuthenticatedLayout>
    );
}
