import SecondaryButton from "@/Components/SecondaryButton";
import SellerLayout from "@/Layouts/SellerLayout";
import { Head } from "@inertiajs/react";
import React, { useState } from "react";
import Modal from "@/Components/Modal";
import axios from "axios";
export default function Requests({ requests: IntialRequests }) {
    const [requests, setRequests] = useState(IntialRequests || []);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [requestIdToCancel, setRequestIdToCancel] = useState(null);

    const handleCancelRequest = async () => {
        try {
            const response = await axios.post(`/seller/building/requests/${requestIdToCancel}/cancel`);

            if (response.data.success) {
                // Update the specific request's status in state
                const updatedRequests = requests.map((req) =>
                    req.id === requestIdToCancel ? { ...req, status: "cancelled" } : req
                );
                setRequests(updatedRequests);
                setShowCancelModal(false);
            } else {
                console.error("Error cancelling request:", response.data.message);
            }
        } catch (error) {
            console.error("Error cancelling request:", error);
        }
    };

    return (
        <SellerLayout>
            <Head title="Requests" />

            <div className="max-w-3xl mx-auto p-6">
                <h2 className="text-xl font-semibold mb-6">Building Requests</h2>

                {requests.length === 0 ? (
                    <p className="text-gray-500">No requests found.</p>
                ) : (
                    <div className="space-y-6">
                        {requests.map((req) => (
                            <div
                                key={req.id}
                                className="border rounded-lg shadow-sm p-4"
                            >
                                <div className="flex items-center space-x-4">
                                    <img
                                        src={`/storage/${req.image}`}
                                        alt={req.name}
                                        className="w-24 h-24 object-cover rounded-md"
                                    />
                                    <div>
                                        <h3 className="text-lg font-bold">
                                            {req.name}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Status:{" "}
                                            <span
                                                className={`px-2 py-1 rounded ${req.status === "pending"
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : "bg-green-100 text-green-700"
                                                    }`}
                                            >
                                                {req.status}
                                            </span>
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            Rooms: {req.number_of_rooms} | Floors:{" "}
                                            {req.number_of_floors}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            Submitted:{" "}
                                            {new Date(
                                                req.created_at
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-3 space-y-1 text-sm">
                                    <p>
                                        <strong>Latitude:</strong> {req.latitude}
                                    </p>
                                    <p>
                                        <strong>Longitude:</strong>{" "}
                                        {req.longitude}
                                    </p>
                                    <p>
                                        <strong>Amenities:</strong>{" "}
                                        {req.amenities?.join(", ")}
                                    </p>
                                </div>

                                <div className="mt-3 flex flex-wrap gap-4 text-sm">
                                    <a
                                        href={`/storage/${req.bir}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        View BIR Document
                                    </a>
                                    <a
                                        href={`/storage/${req.fire_safety_certificate}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-blue-600 hover:underline"
                                    >
                                        View Fire Safety Certificate
                                    </a>
                                </div>

                                {req.status === "pending" && (
                                    <SecondaryButton
                                        onClick={() => {
                                            setShowCancelModal(true);
                                            setRequestIdToCancel(req.id);
                                        }}
                                        className="mt-4 bg-red-600 text-white hover:bg-red-700"
                                    >Cancel</SecondaryButton>)}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Cancel Request Modal */}
            {showCancelModal && (
                <Modal
                    show={showCancelModal}
                    onClose={() => setShowCancelModal(false)}
                >
                    <div>
                        <h2>Cancel Request</h2>
                        <p>
                            Are you sure you want to cancel this request? This
                            action cannot be undone.
                        </p>
                        <div className="flex justify-end">
                            <SecondaryButton
                                onClick={() => setShowCancelModal(false)}
                                className="mr-2"
                            >
                                Cancel
                            </SecondaryButton>
                            <SecondaryButton
                                onClick={handleCancelRequest}
                                className="bg-red-600 text-white hover:bg-red-700"
                            >
                                Confirm
                            </SecondaryButton>
                        </div>
                    </div>
                </Modal>
            )}
        </SellerLayout>
    );
}
