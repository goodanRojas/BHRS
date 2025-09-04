import AuthenticatedLayout from "../../AuthenticatedLayout";
import { Link, Head } from "@inertiajs/react";
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

    const handleRejectApplication = async () => {
        setProcessing(true);
        try {
            await axios.post("/admin/owner/building/application/reject", {
                id: application.id,
            });
            setShowRejectModal(false);
        } catch (error) {
            console.error("Error rejecting application:", error);
        }
        setProcessing(false);
    };
    return (
        <AuthenticatedLayout>
            <Head title="Building Application Review" />
            <div className="p-6 max-w-3xl mx-auto bg-white rounded-lg shadow">
                <h1 className="text-2xl font-semibold mb-4">
                    Building Application Review
                </h1>

                {/* Owner Info */}
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Owner</h2>
                    <p>{application.seller?.name}</p>
                    <p className="text-sm text-gray-600">{application.seller?.email}</p>
                </div>

                {/* Building Info */}
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Building Information</h2>
                    <p><strong>Name:</strong> {application.name}</p>
                    <p><strong>Floors:</strong> {application.number_of_floors}</p>
                    <p><strong>Rooms:</strong> {application.number_of_rooms}</p>
                </div>

                {/* Address */}
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Address</h2>

                    <p>
                        {application.address.address.barangay}, {application.address.address.municipality},{" "}
                        {application.address.address.province}, {application.address.address.region}
                    </p>

                </div>

                {/* Amenities */}
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Amenities</h2>
                    {amenities.length > 0 ? (
                        <ul className="list-disc ml-6">
                            {amenities.map((a, idx) => (
                                <li key={idx}>{a}</li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500">No amenities listed</p>
                    )}
                </div>

                {/* Documents */}
                <div className="mb-4">
                    <h2 className="text-lg font-semibold">Documents</h2>
                    <p>
                        <strong>BIR:</strong>{" "}
                        <a
                            href={`/storage/${application.bir}`}
                            target="_blank"
                            className="text-blue-600 hover:underline"
                        >
                            View File
                        </a>
                    </p>
                    <p>
                        <strong>Fire Safety Certificate:</strong>{" "}
                        <a
                            href={`/storage/${application.fire_safety_certificate}`}
                            target="_blank"
                            className="text-blue-600 hover:underline"
                        >
                            View File
                        </a>
                    </p>
                </div>

                {/* Actions */}
                <div className="flex gap-4 mt-6">
                    <PrimaryButton
                        onClick={() => setShowAcceptModal(true)}
                        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">
                        Approve
                    </PrimaryButton>
                    <SecondaryButton
                        onClick={() => setShowRejectModal(true)}
                        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
                        Reject
                    </SecondaryButton>
                </div>
            </div>

            {/* Accept Modal */}
            <Modal show={showAcceptModal} onClose={() => setShowAcceptModal(false)}>
                <div className="p-6">
                    <h2 className="text-lg font-bold mb-2">Confirm Acceptance</h2>
                    <p className="text-sm text-gray-600 mb-6">
                        Are you sure you want to <span className="font-semibold text-green-600">accept</span> this application?
                    </p>
                    <div className="flex justify-end gap-3">
                        <PrimaryButton
                            className="px-5 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition w-full sm:w-auto"
                            onClick={() => setShowAcceptModal(false)}
                            disabled={processing}
                        >
                            Cancel
                        </PrimaryButton>
                        <PrimaryButton
                            className="px-5 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-indigo-300 disabled:cursor-not-allowed transition w-full sm:w-auto"
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
                <div className="p-6">
                    <h2 className="text-lg font-bold mb-2">Reject Application</h2>
                    <p className="text-sm text-gray-600 mb-6">
                        Are you sure you want to <span className="font-semibold text-red-600">reject</span> this application?
                    </p>
                    <div className="flex justify-end gap-3">
                        <button
                            className="px-5 py-3 rounded-xl bg-gray-100 text-gray-700 font-medium hover:bg-gray-200 transition w-full sm:w-auto"
                            onClick={() => setShowRejectModal(false)}
                            disabled={processing}
                        >
                            Cancel
                        </button>
                        <button
                            className="px-5 py-3 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-indigo-400 disabled:bg-indigo-300 disabled:cursor-not-allowed transition w-full sm:w-auto"
                            onClick={handleRejectApplication}
                            disabled={processing}
                        >
                            {processing ? "Processing..." : "Confirm"}
                        </button>
                    </div>
                </div>
            </Modal>
        </AuthenticatedLayout>
    );
}
