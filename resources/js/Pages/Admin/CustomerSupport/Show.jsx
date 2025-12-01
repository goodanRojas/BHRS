import AuthenticatedLayout from "../AuthenticatedLayout";
import { Head, useForm, usePage } from "@inertiajs/react";
import Breadcrumbs from "@/Components/Breadcrumbs";
import { motion } from "framer-motion";
import { Paperclip, User, Calendar, CheckCircle, Edit, Send } from "lucide-react";
import Toast from "@/Components/Toast";
export default function Show({ ticket }) {
    const { data, setData, post, patch, processing } = useForm({
        response: ticket.response || "",
    });

    const props = usePage().props;

    const submitReply = (e) => {
        e.preventDefault();
        if (ticket.response) {
            // Edit existing response
            patch(route("admin.customer.support.update", ticket.id), {
                onSuccess: () => console.log("Response updated"),
            });
        } else {
            // Add new response
            post(route("admin.customer.support.reply", ticket.id), {
                onSuccess: () => console.log("Response submitted"),
            });
        }
    };

    return (
        <AuthenticatedLayout>
            <Head title={`Ticket ${ticket.id}`} />
            {props.flash.message && (
                <Toast
                    isTrue={props.flash.message ? true : false}
                    message={props.flash.message}
                    isType={props.flash.success ? "success" : "error"}
                    id={Date.now()}
                />
            )}
            <Breadcrumbs
                links={[
                    { label: "Customer Support", url: "/admin/customer/support/" },
                    { label: `Ticket #${ticket.id}` },
                ]}
            />

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="p-6 max-w-4xl mx-auto space-y-6"
            >
                {/* Ticket Header */}
                <h1 className="text-3xl font-bold text-gray-800">
                    Support Ticket #{ticket.id}
                </h1>

                <div className="bg-white rounded-xl shadow p-6 space-y-4">
                    {/* User Info */}
                    <div className="flex items-center gap-4">
                        <User size={24} className="text-gray-500" />
                        <div>
                            <p className="font-medium">{ticket.supportable.name}</p>
                            <p className="text-gray-500 text-sm">{ticket.supportable.email}</p>
                        </div>
                    </div>

                    {/* Ticket Details */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Submitted by</p>
                            <p className="font-medium">{ticket.name} ({ticket.email})</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Category</p>
                            <p className="font-medium capitalize">{ticket.category || "N/A"}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Priority</p>
                            <p className={`inline-block px-3 py-1 rounded-full text-xs ${
                                ticket.priority === "high"
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
                            <p className={`inline-block px-3 py-1 rounded-full text-xs ${
                                ticket.status === "open"
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

                    {/* Admin Response */}
                    <div className="mt-6">
                        <p className="text-sm text-gray-500 mb-2">
                            {ticket.response ? "Edit Response" : "Add Response"}
                        </p>
                        <form onSubmit={submitReply} className="flex flex-col gap-2">
                            <textarea
                                rows={4}
                                className="w-full p-3 border rounded-lg"
                                placeholder="Type your response..."
                                value={data.response}
                                onChange={(e) => setData("response", e.target.value)}
                                required
                            />
                            <button
                                type="submit"
                                disabled={processing}
                                className="self-start bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                            >
                                {ticket.response ? (
                                    <>
                                        <Edit size={16} /> Update Response
                                    </>
                                ) : (
                                    <>
                                        <Send size={16} /> Send Response
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </motion.div>
        </AuthenticatedLayout>
    );
}
