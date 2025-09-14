import axios from "axios";
import { useState } from "react";
import Toast from "@/Components/Toast";
import { Head } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Modal from "@/Components/Modal";

export default function Applications({ applications }) {
    const [toast, setToast] = useState({ show: false, message: "", type: "" });
    const [data, setData] = useState(applications);
    const [confirmModal, setConfirmModal] = useState({ show: false, id: null });

    const openConfirm = (id) => {
        setConfirmModal({ show: true, id });
    };

    const closeConfirm = () => {
        setConfirmModal({ show: false, id: null });
    };

    const confirmCancel = async () => {
        if (!confirmModal.id) return;
        try {
            const response = await axios.put(
                `/seller/register/${confirmModal.id}/cancel`
            );

            if (response.data.success) {
                // ✅ update local table
                setData((prev) =>
                    prev.map((app) =>
                        app.id === confirmModal.id
                            ? { ...app, status: "cancelled" }
                            : app
                    )
                );

                // ✅ toast
                setToast({
                    show: true,
                    message: response.data.message,
                    type: "success",
                });
            }
        } catch (error) {
            setToast({
                show: true,
                message: "Something went wrong while cancelling.",
                type: "error",
            });
        } finally {
            closeConfirm();
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title="Request Applications" />
            <Toast
                message={toast.message}
                isTrue={toast.show}
                isType={toast.type}
            />
            {data.length > 0 ? (
                <div className="max-w-6xl mx-auto mt-8 bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="px-6 py-4 border-b">
                        <h2 className="text-xl font-bold text-gray-800">Request Applications</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="bg-gray-50 text-left text-gray-600">
                                    <th className="px-4 py-3">#</th>
                                    <th className="px-4 py-3">Full Name</th>
                                    <th className="px-4 py-3">Email</th>
                                    <th className="px-4 py-3">Phone</th>
                                    <th className="px-4 py-3">Address</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Documents</th>
                                    <th className="px-4 py-3 text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {data.map((app, index) => (
                                    <tr key={app.id} className="hover:bg-gray-50 transition">
                                        <td className="px-4 py-3">{index + 1}</td>
                                        <td className="px-4 py-3 font-medium text-gray-800">{app.fullname}</td>
                                        <td className="px-4 py-3 text-gray-600">{app.email}</td>
                                        <td className="px-4 py-3 text-gray-600">{app.phone}</td>
                                        <td className="px-4 py-3 text-gray-600">
                                            {app.address?.address.barangay},{" "}
                                            {app.address?.address.municipality},{" "}
                                            {app.address?.address.province}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span
                                                className={`px-2 py-1 rounded-full text-xs font-semibold
                                        ${app.status === "approved"
                                                        ? "bg-green-100 text-green-700"
                                                        : app.status === "pending"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : app.status === "cancelled" ||
                                                                app.status === "rejected"
                                                                ? "bg-red-100 text-red-700"
                                                                : "bg-gray-100 text-gray-600"
                                                    }`}
                                            >
                                                {app.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 space-y-1">
                                            <a
                                                href={`/storage/${app.landOwnerPaper}`}
                                                target="_blank"
                                                className="inline-block text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                                            >
                                                Land Owner Paper
                                            </a>
                                            <a
                                                href={`/storage/${app.bir}`}
                                                target="_blank"
                                                className="inline-block text-xs px-2 py-1 bg-indigo-100 text-indigo-700 rounded hover:bg-indigo-200"
                                            >
                                                BIR
                                            </a>
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            {app.status !== "cancelled" && (
                                                <button
                                                    className="px-4 py-2 bg-yellow-500 text-white text-sm rounded-lg shadow hover:bg-yellow-600 transition"
                                                    onClick={() => openConfirm(app.id)}
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="flex justify-center items-center px-6 mt-10">
                    <p className="text-gray-500 text-center py-10 px-6 bg-white rounded-xl shadow-lg">
                        No applications submitted yet.
                    </p>
                </div>
            )}


            {/* Cancel Confirmation Modal */}
            <Modal show={confirmModal.show} onClose={closeConfirm} maxWidth="md">
                <h3 className="text-lg font-bold mb-4 text-gray-800">
                    Cancel Application
                </h3>
                <p className="text-gray-600 mb-6">
                    Are you sure you want to{" "}
                    <span className="font-semibold text-yellow-600">cancel</span>{" "}
                    this application?
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={closeConfirm}
                        className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
                    >
                        No
                    </button>
                    <button
                        onClick={confirmCancel}
                        className="px-4 py-2 rounded bg-yellow-500 text-white hover:bg-yellow-600"
                    >
                        Yes, Cancel
                    </button>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
