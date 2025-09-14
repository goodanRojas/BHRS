import { Link } from "@inertiajs/react";
import { motion } from "framer-motion";

export default function Landing({ plans, pending }) {
    // Animation variants
    const container = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2, // delay between cards
            },
        },
    };

    const card = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 to-white p-8">
            {pending && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mb-6 self-start"
                >
                    <Link
                        href={route("seller.subscription.pending")}
                        className="inline-block px-5 py-2 rounded-lg font-semibold text-indigo-600 
                           bg-indigo-50 hover:bg-indigo-100 hover:text-indigo-700 
                           transition-colors shadow-sm"
                    >
                        Pending
                    </Link>
                </motion.div>
            )}
            <div className="max-w-6xl text-center">
                <h1 className="text-4xl font-extrabold text-indigo-900 mb-4">
                    Welcome to the Boarding House Reservation System 🎉
                </h1>
                <p className="text-gray-600 mb-12">
                    To start using the system, please choose a subscription plan that best fits your needs.
                </p>

                <motion.div
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={container}
                    initial="hidden"
                    animate="show"
                >
                    {plans.map((plan) => (
                        <motion.div
                            key={plan.id}
                            variants={card}
                            className="group relative flex flex-col p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100"
                        >
                            {/* Highlight bar */}
                            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-indigo-600 opacity-0 group-hover:opacity-100 transition"></div>

                            <h2 className="text-2xl font-bold text-indigo-800 mb-1">
                                {plan.plan.charAt(0).toUpperCase() + plan.plan.slice(1)}
                            </h2>
                            <p className="text-gray-500 text-sm">{plan.duration_days} days access</p>

                            <p className="text-3xl font-extrabold text-indigo-700 mt-4">
                                ₱{plan.price}
                                <span className="text-sm font-medium text-gray-500">
                                    {" "}
                                    / {plan.duration_days} days
                                </span>
                            </p>

                            <ul className="text-sm text-gray-700 mt-6 space-y-2 text-left">
                                {plan.features.map((f, i) => (
                                    <li key={i} className="flex items-center">
                                        <span className="text-green-500 mr-2">✔</span>
                                        {f}
                                    </li>
                                ))}
                            </ul>

                            <Link
                                href={route("seller.subscription.choose", plan.id)}
                                className="mt-8 inline-block w-full px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition text-center shadow-sm"
                            >
                                Subscribe
                            </Link>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </div>
    );
}
