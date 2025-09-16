import { useState, useEffect } from "react";
import { Link, Head, usePage } from "@inertiajs/react";
import { motion, AnimatePresence } from "framer-motion";
import SellerLayout from "@/Layouts/SellerLayout";

export default function Bedrequests({ Requests: Initialrequests }) {
    const user = usePage().props.auth.seller;
    const [requests, setRequests] = useState(Initialrequests || []);

    useEffect(() => {
        const ownerId = user?.id;
        if (!ownerId) return;

        const channel = window.Echo.private(`owner.${ownerId}`).listen(
            ".NewBooking",
            (e) => {
                console.log("🔔 New booking received!", e);
                setRequests((prev) => [...prev, e.booking]);
            }
        );

        return () => {
            channel.stopListening(".NewBooking");
        };
    }, [user?.id]);

    const calculateMonths = (startDate, endDate) => {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const yearsDifference = end.getFullYear() - start.getFullYear();
        const monthsDifference = end.getMonth() - start.getMonth();
        return yearsDifference * 12 + monthsDifference;
    };

    return (
        <SellerLayout>
            <Head title="Current Requests" />
            <div className="p-6">
                <h1 className="text-2xl font-semibold text-gray-800 mb-6">
                    Current Bed Requests
                </h1>

                {requests.length === 0 ? (
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-gray-500 text-center py-10"
                    >
                        No bed requests found.
                    </motion.p>
                ) : (
                    <div className="overflow-x-auto bg-white rounded-2xl shadow-lg border border-gray-100">
                        <table className="min-w-full text-sm text-gray-700">
                            <thead className="bg-indigo-100/70 text-indigo-800 uppercase text-xs tracking-wider">
                                <tr>
                                    <th className="px-6 py-3 text-left">User</th>
                                    <th className="px-6 py-3 text-left">Booking</th>
                                    <th className="px-6 py-3 text-left">Payment</th>
                                    <th className="px-6 py-3 text-left">Action</th>
                                </tr>
                            </thead>
                            <AnimatePresence component="tbody">
                                {requests.map((request, index) => {
                                    const startDate = new Date(request.start_date);
                                    const endDate = new Date(request.end_date);
                                    const monthCount = calculateMonths(
                                        startDate,
                                        endDate
                                    );

                                    return (
                                        <motion.tr
                                            key={request.id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{
                                                duration: 0.3,
                                                delay: index * 0.05,
                                            }}
                                            className="border-t border-gray-200 hover:bg-indigo-50/50 transition"
                                        >
                                            {/* User */}
                                            <td className="px-6 py-4 flex items-center gap-3 whitespace-nowrap">
                                                <img
                                                    src={`/storage/${
                                                        request.user.avatar ||
                                                        "profile/default_avatar.png"
                                                    }`}
                                                    alt={request.user.name}
                                                    className="w-11 h-11 rounded-full border object-cover shadow-sm"
                                                />
                                                <div>
                                                    <p className="font-medium text-gray-800">
                                                        {request.user.name}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {request.user.email}
                                                    </p>
                                                    {request.user.address && (
                                                        <p className="text-xs text-gray-400">
                                                            {request.user.address}
                                                        </p>
                                                    )}
                                                </div>
                                            </td>

                                            {/* Booking Info */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <p className="font-semibold text-gray-700">
                                                    {request.bookable.name}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Start:{" "}
                                                    {startDate.toLocaleDateString()}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    End: {endDate.toLocaleDateString()}
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    Duration: {monthCount}{" "}
                                                    month{monthCount > 1 ? "s" : ""}
                                                </p>
                                            </td>

                                            {/* Payment */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                    {request.payment_method}
                                                </span>
                                            </td>

                                            {/* Action */}
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <motion.div whileHover={{ scale: 1.05 }}>
                                                    <Link
                                                        href={`/seller/request/bed/${request.id}`}
                                                        className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white text-xs font-medium rounded-full shadow hover:bg-indigo-700 transition"
                                                    >
                                                        View Details
                                                    </Link>
                                                </motion.div>
                                            </td>
                                        </motion.tr>
                                    );
                                })}
                            </AnimatePresence>
                        </table>
                    </div>
                )}
            </div>
        </SellerLayout>
    );
}
