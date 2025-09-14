import AuthenticatedLayout from "../../AuthenticatedLayout";
import { motion } from "framer-motion";

export default function Show({ subscription }) {
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
                    <p>Start Date: <span className="font-medium">{new Date(subscription.start_date).toLocaleDateString("en-PH", { weekday:"short", year:"numeric", month:"short", day:"numeric" })}</span></p>
                    <p>End Date: <span className="font-medium">{new Date(subscription.end_date).toLocaleDateString("en-PH", { weekday:"short", year:"numeric", month:"short", day:"numeric" })}</span></p>
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
            </motion.div>
        </AuthenticatedLayout>
    );
}
