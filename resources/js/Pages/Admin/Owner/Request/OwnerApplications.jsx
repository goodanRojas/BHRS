import AuthenticatedLayout from "../../AuthenticatedLayout";
import { Head, Link } from '@inertiajs/react';

export default function OwnerApplications({ applications }) {
   
    const handleShowApplication = (id) => {
       document.location.href = `/admin/applications/show/${id}`;
    };
    return (
        <AuthenticatedLayout>
            <Head title="Applications" />

            <div className="p-6 max-w-6xl mx-auto space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">Applications</h1>

                {applications.length === 0 ? (
                    <p className="text-gray-500 text-center py-10 bg-white rounded-lg shadow">
                        No applications submitted yet.
                    </p>
                ) : (
                    <div className="overflow-x-auto bg-white shadow-md rounded-xl">
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr className="bg-gray-100 text-left">
                                    <th className="p-3 border">#</th>
                                    <th className="p-3 border">Full Name</th>
                                    <th className="p-3 border">Email</th>
                                    <th className="p-3 border">Phone</th>
                                    <th className="p-3 border">Status</th>
                                    <th className="p-3 border">Submitted At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {applications.map((app, index) => (
                                    <tr 
                                        onClick={() => handleShowApplication(app.id)}
                                    key={app.id} className="hover:bg-gray-50 hover:cursor-pointer transition-all">
                                        <td className="p-3 border">{index + 1}</td>
                                        <td className="p-3 border">{app.fullname}</td>
                                        <td className="p-3 border">{app.email}</td>
                                        <td className="p-3 border">{app.phone}</td>
                                        <td className="p-3 border">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${
                                                    app.status === "approved"
                                                        ? "bg-green-100 text-green-700"
                                                        : app.status === "cancelled"
                                                        ? "bg-red-100 text-red-700"
                                                        : "bg-yellow-100 text-yellow-700"
                                                }`}
                                            >
                                                {app.status}
                                            </span>
                                        </td>
                                   
                                        <td className="p-3 border">
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
