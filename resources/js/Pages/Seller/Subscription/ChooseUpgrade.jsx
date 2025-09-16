import { motion } from "framer-motion";
import { Link, useForm } from "@inertiajs/react";
import { useEffect, useState } from "react";
export default function ChooseUpgrade({ plan, paymentInfo }) {
    console.log(paymentInfo);

    const staticFeatures = {
        Bronze: [
            "Basic listing visibility",
            "Up to 5 rooms",
            "Email support",
        ],
        Silver: [
            "Priority listing visibility",
            "Up to 15 rooms",
            "Email & chat support",
            "Custom branding",
        ],
        Gold: [
            "Top search placement",
            "Unlimited rooms",
            "24/7 support",
            "Advanced analytics",
            "Custom promotions",
        ],
    };
    return (
        <div className="min-h-screen bg-gray-50 flex justify-center items-center p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="bg-white shadow-xl rounded-2xl max-w-lg w-full p-8"
            >
                {/* Header */}
                <motion.h1
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-2xl font-bold text-gray-800 text-center"
                >
                    Upgrade to <span className="text-indigo-600">{plan.plan}</span>
                </motion.h1>
                <p className="mt-2 text-center text-gray-500">
                    Unlock premium features for your business
                </p>

                {/* Plan Card */}
                <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="mt-6 mb-6 border border-gray-200 rounded-xl p-6 bg-gradient-to-br from-indigo-50 to-white shadow-sm"
                >
                    <h2 className="text-xl font-semibold text-gray-800">{plan.plan} Plan</h2>
                    <p className="mt-2 text-gray-600">
                        Duration: <span className="font-medium">{plan.duration_days} days</span>
                    </p>
                    <p className="mt-1 text-gray-600">
                        Price:{" "}
                        <span className="font-bold text-indigo-600">₱{plan.price}</span>
                    </p>

                    <ul className="mt-4 space-y-2">
                        {(staticFeatures[plan.plan] || []).map((feature, idx) => (
                            <motion.li
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.1 * idx }}
                                className="flex items-center text-gray-700"
                            >
                                <span className="mr-2 text-green-500">✔</span> {feature}
                            </motion.li>
                        ))}
                    </ul>
                </motion.div>

                {/* GCash Payment Info */}
                {paymentInfo && (
                    <motion.div
                        className="bg-indigo-50 rounded-2xl shadow-inner p-6"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="text-xl font-semibold text-indigo-800 mb-6">
                            Where to Pay
                        </h2>

                        <div className="flex flex-col items-center space-y-4">
                            <img
                                src={`/storage/${paymentInfo.qr_code}`}
                                alt="GCash QR"
                                className="w-40 h-40 rounded-xl border border-gray-300 object-contain shadow-md"
                            />

                            <div className="w-full space-y-3 text-center">
                                <div>
                                    <p className="text-sm text-gray-500 uppercase tracking-wide">
                                        GCash Name
                                    </p>
                                    <p className="text-lg font-semibold text-indigo-900">
                                        {paymentInfo.gcash_name}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-500 uppercase tracking-wide">
                                        GCash Number
                                    </p>
                                    <p className="text-lg font-medium text-gray-800">
                                        {paymentInfo.gcash_number}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Upload Receipt Form */}
                <motion.div
                    className="bg-indigo-50 rounded-2xl shadow-inner p-6 mt-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                >
                    <h2 className="text-xl font-semibold text-indigo-800 mb-4">
                        Upload Receipt for {plan.plan}
                    </h2>
                    {/* Upload Receipt Form */}
                    <motion.div
                        className="bg-indigo-50 rounded-2xl shadow-inner p-6"
                    >
                        <SubscriptionForm plan={plan} />
                    </motion.div>
                </motion.div>


                <Link
                    href={route("seller.subscription.upgrade")}
                    className="block text-center mt-4 text-gray-500 hover:text-indigo-600 transition"
                >
                    Cancel
                </Link>
            </motion.div>
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
        post(route("seller.subscription.upgrade.store"));
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
                className="w-full px-4 py-2.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-semibold rounded-full shadow-lg hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700 transition"
            >
                {processing ? "Loading..." : "Upgrade"}
            </motion.button>

        </motion.form>
    );
}
