import AuthenticatedLayout from "../../AuthenticatedLayout";
import { motion } from "framer-motion";
import Modal from "@/Components/Modal";
import { Inertia } from "@inertiajs/inertia";
import { useState, useEffect } from "react";
import { useForm } from "@inertiajs/react";

export default function ShowPending({ subscription }) {

    const [showRejectModal, setShowRejectModal] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        subscription_id: subscription.id,
        receipt: null,
        reference_number: "",
        remarks: "",
    });

    const [preview, setPreview] = useState(null);

    useEffect(() => {
        const file = data.receipt;
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                setPreview(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    }, [data.receipt]);

    const handleConfirm = (e) => {
        e.preventDefault();

        post(route("admin.subscriptions.confirm"), {
            forceFormData: true,
            onSuccess: () => setShowConfirmModal(false),
        });
    };

    const handleReject = () => {
        Inertia.post(route('admin.subscriptions.reject', subscription.id));
        setShowRejectModal(false);
    };
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        },
    };

    const item = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    };

    const sectionClass = "bg-white shadow-lg rounded-2xl p-6 mb-6 border border-gray-100";

    return (
        <AuthenticatedLayout>
            <motion.div
                className="max-w-4xl mx-auto p-6"
                variants={container}
                initial="hidden"
                animate="show"
            >
                {/* Header */}
                <motion.div variants={item} className="mb-6 text-center">
                    <h1 className="text-4xl font-extrabold text-indigo-900 mb-2">
                        Subscription Details
                    </h1>
                    <p className="text-gray-600">
                        Overview of your current subscription plan and seller information.
                    </p>
                </motion.div>

                {/* Plan Info */}
                <motion.div variants={item} className={sectionClass}>
                    <h2 className="text-2xl font-semibold text-indigo-800 mb-4">
                        {subscription.plan.plan} Plan
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <p className="text-gray-500">
                            Price: <span className="font-bold text-indigo-700">₱{subscription.plan.price}</span>
                        </p>
                        <p className="text-gray-500">
                            Duration: <span className="font-semibold">{subscription.plan.duration_days} days</span>
                        </p>
                        <p className="text-gray-500">
                            Status: <span className={`px-3 py-1 rounded-full text-sm font-medium ${subscription.status === "active"
                                ? "bg-green-100 text-green-800"
                                : subscription.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : subscription.status === "canceled" || subscription.status === "rejected"
                                        ? "bg-red-100 text-red-800"
                                        : "bg-gray-100 text-gray-700"
                                }`}>
                                {subscription.status.toUpperCase()}
                            </span>
                        </p>
                    </div>
                </motion.div>

                {/* Features */}
                <motion.div variants={item} className={sectionClass}>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Features</h3>
                    <ul className="list-disc list-inside text-gray-600">
                        {subscription.plan.features.map((feature, i) => (
                            <li key={i}>{feature}</li>
                        ))}
                    </ul>
                </motion.div>

                {/* Dates */}
                <motion.div variants={item} className={sectionClass}>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Subscription Period</h3>
                    <p>Start Date: <span className="font-medium">{new Date(subscription.start_date).toLocaleDateString("en-PH", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}</span></p>
                    <p>End Date: <span className="font-medium">{new Date(subscription.end_date).toLocaleDateString("en-PH", { weekday: "short", year: "numeric", month: "short", day: "numeric" })}</span></p>
                </motion.div>

                {/* Receipt & Reference */}
                <motion.div variants={item} className={sectionClass}>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Payment Details</h3>
                    <p>Reference Number: <span className="font-medium">{subscription.seller_ref_num || "-"}</span></p>
                    <p>Remarks: <span className="font-medium">{subscription.seller_remarks || "-"}</span></p>
                    <p>Seller Receipt: {subscription.seller_receipt_path ? (
                        <a href={`/storage/${subscription.seller_receipt_path}`} target="_blank" rel="noopener noreferrer" className="text-indigo-600 font-medium hover:text-indigo-800">
                            View Receipt
                        </a>
                    ) : <span className="text-gray-500">No receipt uploaded</span>}
                    </p>
                </motion.div>

                {/* Seller Info */}
                <motion.div variants={item} className={sectionClass}>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">Seller Information</h3>
                    <p>Name: <span className="font-medium">{subscription.seller.name}</span></p>
                    <p>Email: <span className="font-medium">{subscription.seller.email}</span></p>
                    <p>Phone: <span className="font-medium">{subscription.seller.phone}</span></p>
                </motion.div>

                <motion.div variants={item} className="flex justify-end gap-4 mt-4">
                    <button
                        onClick={() => setShowRejectModal(true)}
                        className="px-6 py-2 rounded-xl bg-red-600 text-white font-semibold hover:bg-red-700 transition"
                    >
                        Reject
                    </button>
                    <button
                        onClick={() => setShowConfirmModal(true)}
                        className="px-6 py-2 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 transition"
                    >
                        Confirm
                    </button>
                </motion.div>
            </motion.div>

            {/* Reject Modal */}
            <Modal show={showRejectModal} onClose={() => setShowRejectModal(false)}>
                <h2 className="text-xl font-bold mb-4">Reject Subscription</h2>
                <p className="mb-4">Are you sure you want to reject this subscription? It will move to cancelled subscriptions.</p>
                <div className="flex justify-end gap-4">
                    <button onClick={() => setShowRejectModal(false)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
                    <button onClick={handleReject} className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700">Reject</button>
                </div>
            </Modal>

            {/* Confirm Modal */}
            <Modal show={showConfirmModal} onClose={() => setShowConfirmModal(false)}>
                <h2 className="text-xl font-bold mb-4">Confirm Subscription</h2>
                <p className="mb-4">Are you sure you want to confirm this subscription?</p>

                <p>Please provide your receipt detail.</p>
                <form onSubmit={handleConfirm} encType="multipart/form-data">

                    {/* Receipt Upload */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Upload Receipt (image)
                        </label>
                        <div className="flex items-center justify-center w-full">
                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-xl cursor-pointer bg-white hover:bg-gray-50 transition">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <svg
                                        className="w-8 h-8 mb-2 text-indigo-600"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M7 16V4a1 1 0 011-1h8a1 1 0 011 1v12m-4 0v4m0 0H9m4 0h4"
                                        />
                                    </svg>
                                    <p className="text-sm text-gray-500">Click to upload or drag & drop</p>
                                </div>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData("receipt", e.target.files[0])}
                                    className="hidden"
                                />
                            </label>
                        </div>
                        {errors.receipt && (
                            <p className="text-red-500 text-sm mt-1">{errors.receipt}</p>
                        )}
                        {/* ✅ Preview */}
                        {preview && (
                            <motion.div
                                className="mt-4"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                            >
                                <img
                                    src={preview}
                                    alt="Receipt Preview"
                                    className="rounded-lg shadow-md border w-full max-h-64 object-contain"
                                />
                            </motion.div>
                        )}
                    </div>

                    {/* Remarks */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Remarks (optional)
                        </label>
                        <textarea
                            value={data.remarks}
                            onChange={(e) => setData("remarks", e.target.value)}
                            rows="4"
                            className="w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-gray-700"
                            placeholder="Add any additional notes about your payment..."
                        ></textarea>
                        {errors.remarks && (
                            <p className="text-red-500 text-sm mt-1">{errors.remarks}</p>
                        )}
                    </div>

                    {/* Reference Number */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Reference Number (optional)
                        </label>
                        <input
                            type="text"
                            value={data.reference_number}
                            onChange={(e) => setData("reference_number", e.target.value)}
                            className="w-full border border-gray-300 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition text-gray-700"
                            placeholder="Enter your reference number..."
                        />
                        {errors.reference_number && (
                            <p className="text-red-500 text-sm mt-1">{errors.reference_number}</p>
                        )}
                    </div>

                    <div className="flex justify-end gap-4">
                        <button type="button" onClick={() => setShowConfirmModal(false)} className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300">Cancel</button>
                        <button type="submit" className="px-4 py-2 rounded bg-green-600 text-white hover:bg-green-700">Confirm</button>
                    </div>
                </form>

            </Modal>
        </AuthenticatedLayout>
    );
}
