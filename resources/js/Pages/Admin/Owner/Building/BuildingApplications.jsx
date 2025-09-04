import { useEffect, useState } from "react";
import AuthenticatedLayout from "../../AuthenticatedLayout";
import { Head, Link, usePage } from "@inertiajs/react";
export default function BuildingApplication({ applications: initialApplications }) {

    const admin = usePage().props.auth.user;
    const [applications, setApplications] = useState(initialApplications);

    useEffect(() => {
        const channel = window.Echo.private(`admin-new-building-app.${admin?.id}`)

            .listen('.ToAdminNewBuildingAppEvent', (e) => {
                console.log('🔔 New booking approved received!', e);
                setApplications((prev) => [ e.application, ...prev]);
            });

        return () => {
            channel.stopListening('.ToAdminNewBuildingAppEvent');
            window.Echo.leave(`private-admin-new-building-app.${admin.id}`);
        };
    }, [admin?.id]);

    return (
        <AuthenticatedLayout>
            <Head title="Building Applications" />
            <div className="p-6">
                <h1 className="text-xl font-semibold mb-4">Building Applications</h1>

                {applications.length === 0 ? (
                    <p className="text-gray-600">No applications submitted yet.</p>
                ) : (
                    <div className="overflow-x-auto bg-white shadow rounded-lg">
                        <table className="w-full border-collapse">
                            <thead className="bg-gray-100">
                                <tr>
                                    <th className="text-left px-4 py-2">Owner</th>
                                    <th className="text-left px-4 py-2">Building Name</th>
                                    <th className="text-left px-4 py-2">Floors</th>
                                    <th className="text-left px-4 py-2">Rooms</th>
                                    <th className="text-left px-4 py-2">Submitted</th>
                                    <th className="text-left px-4 py-2">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map((app) => (
                                    <tr key={app.id} className="border-b hover:bg-gray-50">
                                        <td className="px-4 py-2">
                                            {app.seller?.name ?? "N/A"}
                                        </td>
                                        <td className="px-4 py-2">{app.name}</td>
                                        <td className="px-4 py-2">{app.number_of_floors}</td>
                                        <td className="px-4 py-2">{app.number_of_rooms}</td>
                                        <td className="px-4 py-2">
                                            {new Date(app.created_at).toLocaleDateString()}
                                        </td>
                                        <td className="px-4 py-2">
                                            <Link
                                                href={route("admin.owner.building.application.show", app.id)}
                                                className="text-blue-600 hover:underline"
                                            >
                                                Review
                                            </Link>
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
