import { Link, usePage } from "@inertiajs/react";
import { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import Toast from "@/Components/Toast";

export default function Upgrade({ currentPlan, plans }) {
    const { flash } = usePage().props;
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    useEffect(() => {
        if (flash?.message) {
            setToast({ show: true, message: flash.message, type: 'warning' });
        }
    }, [flash?.message]);
    const container = {
        hidden: { opacity: 0 },
        show: { opacity: 1, transition: { staggerChildren: 0.2 } },
    };

    const item = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    };

    // filter upgrade plans
    const availablePlans = useMemo(() => {
        if (!currentPlan) return plans;

        const order = ["bronze", "silver", "gold"];
        const currentIndex = order.indexOf(currentPlan.plan.plan.toLowerCase());

        return plans.filter((p) => order.indexOf(p.plan.toLowerCase()) > currentIndex);
    }, [currentPlan, plans]);

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <Toast message={toast.message} isTrue={toast.show} isType={toast.type} id={Date.now()} />
            {/* Back Button */}
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

            {availablePlans.length > 0 ? (
                <motion.div
                    className="grid md:grid-cols-2 gap-8 items-start"
                    variants={container}
                    initial="hidden"
                    animate="show"
                >
                    {availablePlans.map((plan) => (
                        <motion.div
                            key={plan.id}
                            variants={item}
                            className="group relative flex flex-col p-6 bg-white rounded-2xl shadow-md hover:shadow-xl transition duration-300 border border-gray-100"
                        >
                            {/* Highlight bar */}
                            <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-indigo-600 opacity-0 group-hover:opacity-100 transition"></div>

                            {/* Plan Title */}
                            <h2 className="text-2xl font-bold text-indigo-800 mb-1">
                                {plan.plan.charAt(0).toUpperCase() + plan.plan.slice(1)}
                            </h2>
                            <p className="text-gray-500 text-sm">{plan.duration_days} days access</p>

                            {/* Price */}
                            <p className="text-3xl font-extrabold text-indigo-700 mt-4">
                                ₱{plan.price}
                                <span className="text-sm font-medium text-gray-500">
                                    {" "} / {plan.duration_days} days
                                </span>
                            </p>

                            {/* Features */}
                            <ul className="text-sm text-gray-700 mt-6 space-y-2 text-left">
                                {(() => {
                                    let staticFeatures = [];
                                    switch (plan.plan.toLowerCase()) {
                                        case "bronze":
                                            staticFeatures = ["Access to Dashboard", "Basic Support"];
                                            break;
                                        case "silver":
                                            staticFeatures = [
                                                "Access to Dashboard",
                                                "Map Integration",
                                                "AI Chatbot",
                                            ];
                                            break;
                                        case "gold":
                                            staticFeatures = [
                                                "All Silver Features",
                                                "Priority Support",
                                                "Advanced Analytics",
                                            ];
                                            break;
                                        default:
                                            staticFeatures = ["Basic Access"];
                                    }

                                    return staticFeatures.map((f, i) => (
                                        <li key={i} className="flex items-center">
                                            <span className="text-green-500 mr-2">✔</span>
                                            {f}
                                        </li>
                                    ));
                                })()}
                            </ul>

                            {/* Subscribe Button */}
                            <Link
                                href={route("seller.subscription.choose.upgrade", plan.id)}
                                className="mt-8 inline-block w-full px-4 py-2.5 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition text-center shadow-sm"
                            >
                                Upgrade
                            </Link>
                        </motion.div>
                    ))}

                </motion.div>
            ) : (
                <p className="text-center text-gray-600 text-lg">
                    🎉 You already have the highest plan available.
                </p>
            )}
        </div>
    );
}

function getFeatures(plan) {
    switch (plan.toLowerCase()) {
        case "bronze":
            return ["Access to Dashboard", "Basic Support"];
        case "silver":
            return ["Access to Dashboard", "Map Integration", "AI Chatbot"];
        case "gold":
            return ["All Silver Features", "Priority Support", "Advanced Analytics"];
        default:
            return ["Basic Access"];
    }
}
