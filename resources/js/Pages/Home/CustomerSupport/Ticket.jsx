import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Paperclip, User, Calendar, CheckCircle } from "lucide-react";
import Breadcrumbs from "@/Components/Breadcrumbs";

export default function Ticket({ ticket }) {
    return (
        <AuthenticatedLayout>
            <Head title={`Ticket #${ticket.id}`} />


            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="p-6 max-w-4xl mx-auto"
            >
                <Breadcrumbs
                    links={[
                        { url: '/customer/support/', label: 'Customer Support' },
                        { label: `Ticket #${ticket.id}` },
                    ]}
                />
                <h1 className="text-3xl font-bold mb-6 text-gray-800">
                    Support Ticket #{ticket.id}
                </h1>

                <div className="bg-white rounded-xl shadow p-6 space-y-4">
                    {/* User Info */}
                    <div className="flex items-center gap-4">
                        <User size={24} className="text-gray-500" />
                        <div>
                            <p className="font-medium text-gray-800">{ticket.user.name}</p>
                            <p className="text-gray-500 text-sm">{ticket.user.email}</p>
                        </div>
                    </div>

                    {/* Ticket Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Submitted by</p>
                            <p className="font-medium">{ticket.name} ({ticket.email})</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Category</p>
                            <p className="font-medium capitalize">{ticket.category}</p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Priority</p>
                            <p className={`inline-block px-3 py-1 rounded-full text-xs ${ticket.priority === "high"
                                ? "bg-red-100 text-red-600"
                                : ticket.priority === "medium"
                                    ? "bg-yellow-100 text-yellow-600"
                                    : "bg-green-100 text-green-600"
                                }`}>
                                {ticket.priority}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Status</p>
                            <p className={`inline-block px-3 py-1 rounded-full text-xs ${ticket.status === "open"
                                ? "bg-blue-100 text-blue-600"
                                : ticket.status === "in_progress"
                                    ? "bg-yellow-100 text-yellow-600"
                                    : "bg-green-100 text-green-600"
                                }`}>
                                {ticket.status}
                            </p>
                        </div>
                    </div>

                    {/* Message */}
                    <div>
                        <p className="text-sm text-gray-500">Message</p>
                        <p className="mt-1 p-4 bg-gray-50 rounded-lg text-gray-800">{ticket.message}</p>
                    </div>

                    {/* Admin Response */}
                    <div>
                        <p className="text-sm text-gray-500">Admin Response</p>
                        {ticket.response ? (
                            <p className="mt-1 p-4 bg-green-50 rounded-lg text-green-700">{ticket.response}</p>
                        ) : (
                            <p className="mt-1 p-4 bg-gray-50 rounded-lg text-gray-400">No response yet</p>
                        )}
                    </div>

                    {/* Attachment */}
                    {ticket.attachment && (
                        <div className="flex items-center gap-2">
                            <Paperclip size={20} className="text-gray-500" />
                            <a
                                href={`/storage/${ticket.attachment}`}
                                target="_blank"
                                className="text-blue-600 hover:underline"
                            >
                                Download Attachment
                            </a>
                        </div>
                    )}

                    {/* Timestamps */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 text-gray-500 text-sm">
                        <div>
                            <Calendar size={16} className="inline mr-1" />
                            Created: {new Date(ticket.created_at).toLocaleString()}
                        </div>
                        <div>
                            {ticket.resolved_at && (
                                <>
                                    <CheckCircle size={16} className="inline mr-1 text-green-600" />
                                    Resolved: {new Date(ticket.resolved_at).toLocaleString()}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </motion.div>
        </AuthenticatedLayout>
    );
}
