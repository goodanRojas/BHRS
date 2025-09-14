import { Head, Link } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "../../AuthenticatedLayout";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";
import Toast from "@/Components/Toast";

export default function OwnerApplication({ application }) {
    const { id, fullname, email, phone, status, created_at, updated_at, bir, landOwnerPaper, address, user } = application;
    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [rejectedModal, setRejectedModal] = useState(false);
    const [approvedModal, setApprovedModal] = useState(false);
    const [processing, setProcessing] = useState(false);
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });
    const handleAcceptApplication = async () => {
        setProcessing(true);
        try {
            const response = await axios.post(`/admin/applications/approve/${application.id}`);
            setApprovedModal(true);
            setShowAcceptModal(false);
        } catch (error) {
            console.error("Error accepting application:", error);
        }
        setProcessing(false);
    };
    const handleRejectApplication = async () => {
        setProcessing(true);
        try {
            const response = await axios.post(`/admin/applications/reject/${application.id}`);
            setRejectedModal(true);
            setShowRejectModal(false);
        } catch (error) {
            console.error("Error accepting application:", error);
        }
        setProcessing(false);
    };


    return (
        <AuthenticatedLayout>
            <Head title={`Application ${id}`} />
            <Toast message={toast.message} isTrue={toast.show} isType={toast.type} id={Date.now()} />
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

                {/* User Section */}
                <h2 className="text-xl font-semibold text-gray-700">User</h2>
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="w-full border-collapse text-sm">
                        <tbody>
                            <tr>
                                <td className="p-3 border font-medium w-1/3">Image</td>
                                <td className="p-3 border">
                                    <img
                                        src={`/storage/${user?.avatar ? user?.avatar : 'profile/default_avatar.png'}`}
                                        alt="User Avatar"
                                        className="w-20 h-20 rounded-full mr-4"
                                    />

                                </td>
                            </tr>
                            <tr>
                                <td className="p-3 border font-medium w-1/3">User ID</td>
                                <td className="p-3 border">{user?.id}</td>
                            </tr>
                            <tr>
                                <td className="p-3 border font-medium">Name</td>
                                <td className="p-3 border">{user?.name}</td>
                            </tr>
                            <tr>
                                <td className="p-3 border font-medium">Email</td>
                                <td className="p-3 border">{user?.email}</td>
                            </tr>

                        </tbody>
                    </table>
                </div>

                {application.status === "pending" && (
                    < div className="flex flex-col justify-end sm:flex-row gap-4 mt-6">
                        <PrimaryButton
                            onClick={() => setShowAcceptModal(true)}
                            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                        >
                            Approve
                        </PrimaryButton>
                        <SecondaryButton
                            onClick={() => setShowRejectModal(true)}
                            className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                        >
                            Reject
                        </SecondaryButton>
                    </div>
                )}
            </div>

            {/* Accept Modal */}
            <Modal show={showAcceptModal} onClose={() => setShowAcceptModal(false)}>
                <div className="p-6 space-y-4">
                    <h2 className="text-xl font-bold text-gray-800">Confirm Acceptance</h2>
                    <p className="text-gray-600">
                        Are you sure you want to <span className="font-semibold text-green-600">accept</span> this application?
                    </p>
                    <div className="flex flex-col sm:flex-row justify-end gap-3">
                        <PrimaryButton
                            className="px-5 py-3 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 w-full sm:w-auto"
                            onClick={() => setShowAcceptModal(false)}
                            disabled={processing}
                        >
                            Cancel
                        </PrimaryButton>
                        <PrimaryButton
                            className="px-5 py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 disabled:bg-green-300 w-full sm:w-auto"
                            onClick={handleAcceptApplication}
                            disabled={processing}
                        >
                            {processing ? "Processing..." : "Confirm"}
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>

            {/* Reject Modal */}
            <Modal show={showRejectModal} onClose={() => setShowRejectModal(false)}>
                <div className="p-6 space-y-4">
                    <h2 className="text-xl font-bold text-gray-800">Reject Application</h2>
                    <p className="text-gray-600">
                        Are you sure you want to <span className="font-semibold text-red-600">reject</span> this application?
                    </p>
                    <div className="flex flex-col sm:flex-row justify-end gap-3">
                        <SecondaryButton
                            className="px-5 py-3 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 w-full sm:w-auto"
                            onClick={() => setShowRejectModal(false)}
                            disabled={processing}
                        >
                            Cancel
                        </SecondaryButton>
                        <PrimaryButton
                            className="px-5 py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-400 disabled:bg-red-300 w-full sm:w-auto"
                            onClick={handleRejectApplication}
                            disabled={processing}
                        >
                            {processing ? "Processing..." : "Confirm"}
                        </PrimaryButton>
                    </div>
                </div>
            </Modal>

            {/* Rejected Modal */}
            <Modal show={rejectedModal} onClose={() => setRejectedModal(false)}>
                <div className="p-6 space-y-4">
                    <h2 className="text-xl font-bold text-gray-800">Rejected</h2>
                    <p className="text-gray-600">
                        Application has been rejected.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-end gap-3">
                        <Link
                            className="px-5 py-3 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 w-full sm:w-auto"
                            href={route('admin.applications.index')}
                            disabled={processing}
                        >
                            Close
                        </Link>
                    </div>
                </div>
            </Modal>

            {/* Approved Modal */}
            <Modal show={approvedModal} onClose={() => setApprovedModal(false)}>
                <div className="p-6 space-y-4">
                    <h2 className="text-xl font-bold text-gray-800">Approved</h2>
                    <p className="text-gray-600">
                        Application has been approved.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-end gap-3">
                        <Link
                            className="px-5 py-3 rounded-lg bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 w-full sm:w-auto"
                            href={route('admin.applications.index')}
                            disabled={processing}
                        >
                            Close
                        </Link>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout >
    );
}
