import AuthenticatedLayout from "../AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Paperclip, User } from "lucide-react";
import { useEffect, useState } from "react";

export default function Index({ tickets: initialTickets = [] }) {
    const [tickets, setTickets] = useState(initialTickets);
    const admin = usePage().props.auth.user;
    useEffect(() => {
        const channel = Echo.private('new-customer-support-channel')
            .listen('.NewCustomerSupportEvent', (e) => {
                setTickets((tickets) => [e.ticket, ...tickets]);
            });

        return () => {
            Echo.leave('new-customer-support-channel');
        }
    }, [admin?.id]);
    return (
        <AuthenticatedLayout>
            <Head title="Customer Support Tickets" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="p-6 max-w-6xl mx-auto"
            >
                <h1 className="text-3xl font-bold mb-6 text-gray-800">
                    Customer Support Tickets
                </h1>

                <div className="bg-white shadow-lg rounded-xl p-4 overflow-x-auto">
                    <table className="w-full text-left min-w-[700px]">
                        <thead>
                            <tr className="border-b text-gray-600">
                                <th className="py-3">User</th>
                                <th className="py-3">Category</th>
                                <th className="py-3">Message</th>
                                <th className="py-3">Attachment</th>
                                <th className="py-3">Priority</th>
                                <th className="py-3">Status</th>
                                <th className="py-3">Response</th>
                            </tr>
                        </thead>

                        <tbody>
                            {tickets.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="text-center py-10 text-gray-500"
                                    >
                                        No tickets found.
                                    </td>
                                </tr>
                            ) : (
                                tickets.map((ticket, index) => (
                                    <motion.tr
                                        key={ticket.id}
                                        onClick={() => window.location.href = route("admin.customer.support.show", ticket.id)}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="border-b hover:bg-gray-50 transition cursor-pointer"

                                    >
                                        {/* User Info */}
                                        <td className="py-3 flex items-center gap-2">
                                            <img
                                                src={`/storage/${ticket.user.avatar || "storage/profile/default-avatar.png"}`}
                                                alt={ticket.user.name}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="font-medium">{ticket.user.name}</p>
                                                <p className="text-xs text-gray-500">{ticket.user.email}</p>
                                            </div>
                                        </td>

                                        {/* Category */}
                                        <td className="py-3 capitalize">{ticket.category || "N/A"}</td>

                                        {/* Message */}
                                        <td className="py-3">{ticket.message}</td>

                                        {/* Attachment */}
                                        <td className="py-3">
                                            {ticket.attachment ? (
                                                <a
                                                    href={`/storage/${ticket.attachment}`}
                                                    target="_blank"
                                                    className="flex items-center gap-1 text-blue-600 hover:underline"
                                                >
                                                    <Paperclip size={16} /> Download
                                                </a>
                                            ) : (
                                                <span className="text-gray-400">None</span>
                                            )}
                                        </td>

                                        {/* Priority */}
                                        <td className="py-3">
                                            <span
                                                className={`px-3 py-1 text-xs rounded-full ${ticket.priority === "high"
                                                    ? "bg-red-100 text-red-600"
                                                    : ticket.priority === "medium"
                                                        ? "bg-yellow-100 text-yellow-600"
                                                        : "bg-green-100 text-green-600"
                                                    }`}
                                            >
                                                {ticket.priority}
                                            </span>
                                        </td>

                                        {/* Status */}
                                        <td className="py-3">
                                            <span
                                                className={`px-3 py-1 text-xs rounded-full ${ticket.status === "open"
                                                    ? "bg-blue-100 text-blue-600"
                                                    : ticket.status === "in_progress"
                                                        ? "bg-yellow-100 text-yellow-600"
                                                        : "bg-green-100 text-green-600"
                                                    }`}
                                            >
                                                {ticket.status}
                                            </span>
                                        </td>

                                        {/* Response */}
                                        <td className="py-3">
                                            {ticket.response ? (
                                                <span className="text-green-700">{ticket.response}</span>
                                            ) : (
                                                <span className="text-gray-400">No response yet</span>
                                            )}
                                        </td>


                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </motion.div>
        </AuthenticatedLayout>
    );
}
