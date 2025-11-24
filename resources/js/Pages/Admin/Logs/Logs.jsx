import { useState } from "react";
import { motion } from "framer-motion";
import AuthenticatedLayout from "../AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import {
    LogIn,
    User,
    UserCog,
    CheckCircle,
    XCircle,
    CreditCard,
    Activity
} from "lucide-react";

export default function Logs() {
    const [logs] = useState([
        {
            id: 1,
            name: "Daniel Rojas",
            activity: "User Login",
            user_type: "User",
            date: "2025-11-24 08:32 AM",
            icon: LogIn,
        },
        {
            id: 2,
            name: "Maria Santos",
            activity: "Owner Login",
            user_type: "Owner",
            date: "2025-11-24 09:10 AM",
            icon: UserCog,
        },
        {
            id: 3,
            name: "Building Owner - John Cruz",
            activity: "Owner Subscription Activated",
            user_type: "Owner",
            date: "2025-11-24 09:45 AM",
            icon: CreditCard,
        },
        {
            id: 4,
            name: "User - Michael Tan",
            activity: "Booking Confirmed",
            user_type: "User",
            date: "2025-11-24 10:15 AM",
            icon: CheckCircle,
        },
        {
            id: 5,
            name: "User - Jenny P.",
            activity: "Booking Rejected",
            user_type: "User",
            date: "2025-11-24 10:40 AM",
            icon: XCircle,
        },
        // --- New Entries ---
        {
            id: 6,
            name: "Owner - Angela Lim",
            activity: "Subscription Expired",
            user_type: "Owner",
            date: "2025-11-24 11:05 AM",
            icon: CreditCard,
        },
        {
            id: 7,
            name: "User - Mark Reyes",
            activity: "User Logout",
            user_type: "User",
            date: "2025-11-24 11:30 AM",
            icon: LogIn,
        },
        {
            id: 8,
            name: "Owner - Peter Tan",
            activity: "Added New Property",
            user_type: "Owner",
            date: "2025-11-24 11:55 AM",
            icon: UserCog,
        },
        {
            id: 9,
            name: "User - Anna Cruz",
            activity: "Booking Confirmed",
            user_type: "User",
            date: "2025-11-24 12:20 PM",
            icon: CheckCircle,
        },
        {
            id: 10,
            name: "User - Luis Gonzales",
            activity: "Booking Rejected",
            user_type: "User",
            date: "2025-11-24 12:45 PM",
            icon: XCircle,
        },
    ]);


    return (
        <AuthenticatedLayout>
            <Head title="Activity Logs" />
            <motion.h1
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-3xl font-bold mb-6"
            >
                Activity Logs
            </motion.h1>

            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <div className="overflow-x-auto">
                    <table className="w-full table-auto text-left">
                        <thead>
                            <tr className="text-gray-600 border-b">
                                <th className="py-3">ID</th>
                                <th className="py-3">Name</th>
                                <th className="py-3">Activity</th>
                                <th className="py-3">User Type</th>
                                <th className="py-3">Date</th>
                            </tr>
                        </thead>

                        <tbody>
                            {logs.map((log, index) => {
                                const Icon = log.icon;

                                return (
                                    <motion.tr
                                        key={log.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        className="border-b hover:bg-gray-50 transition"
                                    >
                                        <td className="py-3 font-semibold">{log.id}</td>

                                        {/* Name */}
                                        <td className="py-3">{log.name}</td>

                                        {/* Activity */}
                                        <td className="py-3 flex items-center gap-2">
                                            <Icon className="h-4 w-4 text-blue-600" />
                                            {log.activity}
                                        </td>

                                        {/* User Type */}
                                        <td className="py-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${log.user_type === "Owner"
                                                    ? "bg-purple-100 text-purple-700"
                                                    : "bg-blue-100 text-blue-700"
                                                    }`}
                                            >
                                                {log.user_type}
                                            </span>
                                        </td>

                                        {/* Date */}
                                        <td className="py-3 text-gray-500">
                                            {new Date(log.date).toLocaleString("en-US", {
                                                year: "numeric",
                                                month: "short",
                                                day: "numeric",
                                                hour: "2-digit",
                                                minute: "2-digit",
                                                hour12: true,
                                            })}
                                        </td>
                                    </motion.tr>
                                );
                            })}
                        </tbody>

                    </table>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
