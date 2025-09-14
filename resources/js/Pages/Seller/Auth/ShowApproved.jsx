import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";

export default function ShowApproved({ application }) {
    const { id, fullname, email, phone, status, created_at, updated_at, bir, landOwnerPaper, address, user } = application;

    return (
        <AuthenticatedLayout>
            <Head title={`Application ${id}`} />
            <div className="p-6 max-w-4xl mx-auto space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">Application Details</h1>

                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="w-full border-collapse text-sm">
                        <tbody>
                            <tr>
                                <td className="p-3 border font-medium w-1/3">ID</td>
                                <td className="p-3 border">{id}</td>
                            </tr>
                            <tr>
                                <td className="p-3 border font-medium">Full Name</td>
                                <td className="p-3 border">{fullname}</td>
                            </tr>
                            <tr>
                                <td className="p-3 border font-medium">Email</td>
                                <td className="p-3 border">{email}</td>
                            </tr>
                            <tr>
                                <td className="p-3 border font-medium">Phone</td>
                                <td className="p-3 border">{phone}</td>
                            </tr>
                            <tr>
                                <td className="p-3 border font-medium">Status</td>
                                <td className="p-3 border">
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-medium ${status === "approved"
                                            ? "bg-green-100 text-green-700"
                                            : status === "cancelled"
                                                ? "bg-red-100 text-red-700"
                                                : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        {status}
                                    </span>
                                </td>
                            </tr>
                            <tr>
                                <td className="p-3 border font-medium">BIR Document</td>
                                <td className="p-3 border">
                                    {bir ? (
                                        <a
                                            href={`/storage/${bir}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            View Document
                                        </a>
                                    ) : (
                                        "N/A"
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td className="p-3 border font-medium">Land Owner Paper</td>
                                <td className="p-3 border">
                                    {landOwnerPaper ? (
                                        <a
                                            href={`/storage/${landOwnerPaper}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            View Document
                                        </a>
                                    ) : (
                                        "N/A"
                                    )}
                                </td>
                            </tr>
                            <tr>
                                <td className="p-3 border font-medium">Created At</td>
                                <td className="p-3 border">{new Date(created_at).toLocaleString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })}</td>
                            </tr>

                        </tbody>
                    </table>
                </div>

                {/* Address Section */}
                <h2 className="text-xl font-semibold text-gray-700">Address</h2>
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="w-full border-collapse text-sm">
                        <tbody>
                            <tr>
                                <td className="p-3 border font-medium w-1/3">Region</td>
                                <td className="p-3 border">{address?.address?.region}</td>
                            </tr>
                            <tr>
                                <td className="p-3 border font-medium">Province</td>
                                <td className="p-3 border">{address?.address?.province}</td>
                            </tr>
                            <tr>
                                <td className="p-3 border font-medium">Municipality</td>
                                <td className="p-3 border">{address?.address?.municipality}</td>
                            </tr>
                            <tr>
                                <td className="p-3 border font-medium">Barangay</td>
                                <td className="p-3 border">{address?.address?.barangay}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </AuthenticatedLayout>
    );
}