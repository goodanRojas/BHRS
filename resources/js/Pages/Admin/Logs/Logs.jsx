import { motion } from "framer-motion";
import AuthenticatedLayout from "../AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { LogIn, LogOut, UserCog, User } from "lucide-react";

export default function Logs({ logs }) {

    // Extract only the class name from actor_type
    const getUserType = (type) => {
        if (!type) return "Unknown";
        const parts = type.split("\\");
        return parts[parts.length - 1]; // "User", "Seller", "Admin"
    };

    // Choose icon based on activity
    const getActivityIcon = (activity) => {
        if (activity.includes("Logged in")) return LogIn;
        if (activity.includes("Logged out")) return LogOut;
        return UserCog; // default
    };

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
                                const Icon = getActivityIcon(log.activity);
                                const userType = getUserType(log.actor_type);

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
                                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                                    userType === "Seller"
                                                        ? "bg-purple-100 text-purple-700"
                                                        : userType === "User"
                                                        ? "bg-blue-100 text-blue-700"
                                                        : "bg-gray-100 text-gray-700"
                                                }`}
                                            >
                                                {userType}
                                            </span>
                                        </td>

                                        {/* Date */}
                                        <td className="py-3 text-gray-500">
                                            {new Date(log.created_at).toLocaleString("en-US", {
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
