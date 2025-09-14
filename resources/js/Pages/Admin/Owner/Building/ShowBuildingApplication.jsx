import AuthenticatedLayout from "../../AuthenticatedLayout";
import { Link, Head, router } from "@inertiajs/react";
import { useState } from "react";
import Modal from "@/Components/Modal";
import PrimaryButton from "@/Components/PrimaryButton";
import SecondaryButton from "@/Components/SecondaryButton";

export default function ShowApplication({ application }) {
    console.log(application);
    const amenities = Array.isArray(application.amenities)
        ? application.amenities
        : JSON.parse(application.amenities ?? "[]");

    const [processing, setProcessing] = useState(false);
    const [showAcceptModal, setShowAcceptModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);

    const handleAcceptApplication = async () => {
        setProcessing(true);
        try {
            await axios.post("/admin/owner/building/application/approve", {
                id: application.id,
            });
            setShowAcceptModal(false);
        } catch (error) {
            console.error("Error accepting application:", error);
        }
        setProcessing(false);
    };

    const handleRejectApplication = () => {
        setShowRejectModal(false); // close modal
        router.post(`/admin/owner/building/application/reject/${application.id}`);
    };
    return (
        <AuthenticatedLayout>
            <Head title="Building Application Review" />
            <div className="p-6 max-w-4xl mx-auto space-y-6">
                <h1 className="text-3xl font-bold text-gray-800">Building Application Review</h1>

                {/* Owner Info */}
                <div className="p-5 bg-gray-50 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Owner</h2>
                    <p className="text-gray-900 font-medium">{application.seller?.name}</p>
                    <p className="text-gray-500 text-sm">{application.seller?.email}</p>
                </div>

                {/* Building Info */}
                <div className="p-5 bg-white rounded-lg shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-700 mb-3">Building Information</h2>
                    <div className="space-y-1">
                        <p><span className="font-medium">Name:</span> {application.name}</p>
                        <p><span className="font-medium">Floors:</span> {application.number_of_floors}</p>
                        <p><span className="font-medium">Rooms:</span> {application.number_of_rooms}</p>
                    </div>
                </div>

                {/* Address */}
                <div className="p-5 bg-gray-50 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Address</h2>
                    {application.address?.length > 0 ? (
                        <p className="text-gray-800">
                            {address.address.barangay}, {address.address.municipality},{" "}
                            {address.address.province}, {address.address.region}
                        </p>
                    ) : (
                        <p className="text-gray-800">
                           No address provided </p>
                    )}
                </div>

                {/* Amenities */}
                <div className="p-5 bg-white rounded-lg shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Amenities</h2>
                    {amenities.length > 0 ? (
                        <ul className="list-disc ml-6 space-y-1 text-gray-700">
                            {amenities.map((a, idx) => (
                                <li key={idx}>{a}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No amenities listed</p>
                    )}
                </div>

                {/* Documents */}
                <div className="p-5 bg-gray-50 rounded-lg shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-700 mb-2">Documents</h2>
                    <div className="space-y-2 text-gray-800">
                        <p>
                            <span className="font-medium">BIR:</span>{" "}
                            <a
                                href={`/storage/${application.bir}`}
                                target="_blank"
                                className="text-indigo-600 hover:underline"
                            >
                                View File
                            </a>
                        </p>
                        <p>
                            <span className="font-medium">Fire Safety Certificate:</span>{" "}
                            <a
                                href={`/storage/${application.fire_safety_certificate}`}
                                target="_blank"
                                className="text-indigo-600 hover:underline"
                            >
                                View File
                            </a>
                        </p>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col sm:flex-row gap-4 mt-6">
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
        </AuthenticatedLayout>
    );
}
