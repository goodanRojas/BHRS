import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
export default function Approved({ approved }) {
    return (
        <AuthenticatedLayout>
            <Head title="Approved Applications" />
            <div className="p-6 max-w-4xl mx-auto space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">Approved Applications</h1>

                {approved.length > 0 ? (
                    <div className="overflow-x-auto bg-white shadow-md rounded-xl">
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left text-gray-600">
                                    <th className="p-3 border">#</th>
                                    <th className="p-3 border">Full Name</th>
                                    <th className="p-3 border">Email</th>
                                    <th className="p-3 border">Phone</th>
                                    <th className="p-3 border">Status</th>
                                    <th className="p-3 border">Submitted At</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {approved.map((app, index) => (
                                    <tr
                                        onClick={() => {
                                            document.location.href = `/seller/register/${app.id}/show/approved`;
                                        }}
                                        key={app.id}
                                         className="hover:bg-gray-50 hover:cursor-pointer transition">
                                        <td className="p-3 border">{index + 1}</td>
                                        <td className="p-3 border">{app.fullname}</td>
                                        <td className="p-3 border">{app.email}</td>
                                        <td className="p-3 border">{app.phone}</td>
                                        <td className="p-3 border">
                                            <span
                                                className={`px-2 py-1 rounded text-xs font-medium ${app.status === "approved"
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
                ) : (
                    <div className="flex justify-center items-center px-6 mt-10">
                        <p className="text-gray-500 text-center py-10 px-6 bg-white rounded-xl shadow-lg">
                            No applications submitted yet.
                        </p>
                    </div>
                )}
            </div>
        </AuthenticatedLayout>
    );
}