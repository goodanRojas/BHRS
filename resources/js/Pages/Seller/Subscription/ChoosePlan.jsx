import { Link, useForm } from "@inertiajs/react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function ChoosePlan({ selectedPlan, paymentInfo }) {
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.2 },
        },
    };

    const item = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    };

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-6"
            >
                <Link
                    href={route("seller.subscription.landing")}
                    className="inline-block px-5 py-2 rounded-lg font-semibold text-indigo-600 
                           bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-700 
                           transition-colors shadow-sm"
                >
                    ← Back to Plans
                </Link>
            </motion.div>
            {selectedPlan && (
                <motion.div
                    className="grid md:grid-cols-2 gap-8 items-start"
                    variants={container}
                    initial="hidden"
                    animate="show"
                >
                    {/* Plan Info Card */}
                    <motion.div
                        variants={item}
                        className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6"
                    >
                        <h2 className="text-2xl font-bold text-indigo-800 mb-4">
                            {selectedPlan.plan} Plan
                        </h2>

                        <p className="text-3xl font-extrabold text-indigo-700 mb-2">
                            ₱{selectedPlan.price}
                        </p>
                        <p className="text-gray-500 mb-6">
                            {selectedPlan.duration_days} days access
                        </p>

                        <div className="space-y-3">
                            <h3 className="font-semibold text-gray-700">Features</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                {selectedPlan.features.map((f, i) => (
                                    <li key={i} className="flex items-center">
                                        <span className="text-green-500 mr-2">✔</span>
                                        {f}
                                    </li>
                                ))}
                            </ul>
                        </div>

                    </motion.div>
{/* Gcash Payment Info */}
                    <motion.div
                        variants={item}
                        className="bg-indigo-50 rounded-2xl shadow-inner p-6"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                    </motion.div>

                    {/* Upload Receipt Form */}
                    <motion.div
                        variants={item}
                        className="bg-indigo-50 rounded-2xl shadow-inner p-6"
                    >
                        <h2 className="text-xl font-semibold text-indigo-800 mb-4">
                            Upload Receipt for {selectedPlan.plan}
                        </h2>
                        <SubscriptionForm plan={selectedPlan} />
                    </motion.div>
                </motion.div>
            )}
        </div>
    );
}

function SubscriptionForm({ plan }) {
    const { data, setData, post, processing, errors } = useForm({
        plan_id: plan.id,
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
    function submit(e) {
        e.preventDefault();
        post(route("seller.subscription.store"));
    }

    return (
        <motion.form
            onSubmit={submit}
            className="space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
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

            {/* Submit Button */}
            <motion.button
                type="submit"
                disabled={processing}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="w-full px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-lg shadow hover:bg-indigo-700 transition"
            >
                {processing ? "Submitting..." : "Submit"}
            </motion.button>
        </motion.form>
    );
}
