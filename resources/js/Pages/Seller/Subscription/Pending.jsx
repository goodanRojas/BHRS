import Toast from "@/Components/Toast";
import { usePage, Link } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
export default function Pending() {
    const { props } = usePage(); // get all props including flash messages
    const message = props.flash?.message; // your flash message
    const [toast, setToast] = useState({ show: false, message: "", type: "success" });
    useEffect(() => {
        if (message) {
            console.log(message);
            setToast({ show: true, message: message, type: "error" });
        }
    }, [message]);
    return (<>
        <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-10 left-10"
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
        <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-yellow-50 text-yellow-700">
            <Toast message={toast.message} isTrue={toast.show} isType={toast.type} id={Date.now()} />

            {message && (
                <div className="mb-6 px-4 py-2 bg-yellow-100 text-yellow-800 rounded shadow-md">
                    {message}
                </div>
            )}

            <h1 className="text-2xl font-bold mb-4">Subscription Pending</h1>
            <p className="text-gray-800 mb-6">
                Your subscription request has been submitted. Please wait while we verify your payment.
            </p>
            <p className="text-sm text-gray-600">You will be notified once your subscription is approved.</p>
        </div>
    </>
    );
}
