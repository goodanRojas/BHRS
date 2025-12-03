import AuthenticatedLayout from "../AuthenticatedLayout";
import { Head, usePage, router } from "@inertiajs/react";
import { motion } from "framer-motion";
import { Paperclip, User } from "lucide-react";
import { useEffect, useState } from "react";

export default function Index({ tickets: initialTickets = [], sort, direction, search: initialSearch    }) {
    console.log(initialTickets);
    const [tickets, setTickets] = useState(() =>
    initialTickets || { data: [], links: [] }
);
    const [search, setSearch] = useState(initialSearch);
    const admin = usePage().props.auth.user;

    useEffect(() => {
        const channel = Echo.private('new-customer-support-channel')
            .listen('.NewCustomerSupportEvent', (e) => {
                setTickets((tickets) => ({
                    ...tickets,
                    data: [e.ticket, ...tickets.data],
                }));
            });

        return () => {
            Echo.leave('new-customer-support-channel');
        }
    }, [admin?.id]);
    const sortBy = (column) => {
        const isSameColumn = sort === column;
        const newDirection = isSameColumn && direction === 'asc' ? 'desc' : 'asc';

        router.get(route('admin.customer.support.index'), { sort: column, direction: newDirection });
    };

    const handleSearch = (e) => {
        const value = e.target.value;
        setSearch(value);

        router.get(route('admin.customer.support.index'), {
             search: value,
             sort,
             direction},{
                preserveState: true,
                replace: true,
             });
    }
    return (
        <AuthenticatedLayout>
            <Head title="Customer Support Tickets" />

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="p-6 max-w-6xl mx-auto"
            >
             <div className="flex justify-between align-center">   
                <h1 className="text-3xl font-bold mb-6 text-gray-800">
                    Customer Support Tickets
                </h1>
                <div>
                    <input 
                        type="text"
                        value={search}
                        onChange={handleSearch}
                        placeholder="Search..."
                        className="w-full p-3 border rounded-lg"
                    />
                </div>
                </div>

                <div className="bg-white shadow-lg rounded-xl p-4 overflow-x-auto">
                    <table className="w-full text-left min-w-[700px]">
                        <thead>
                            <tr className="border-b text-gray-600">
                                <th className="py-3 cursor-pointer"
                                    onClick={() => sortBy('supportable_id')}>
                                    User
                                    {sort === 'supportable_id' && (
                                        direction === 'asc' ? " ▲" : " ▼"
                                    )}
                                </th>
                                <th className="py-3 cursor-pointer"
                                    onClick={() => sortBy('category')}
                                >
                                    Category
                                    {sort === 'category' && (
                                        direction === 'asc' ? " ▲" : " ▼"
                                    )}
                                </th>
                                <th className="py-3">Message</th>
                                <th className="py-3">Attachment</th>
                                <th className="py-3 cursor-pointer"

                                    onClick={() => sortBy('priority')}
                                >
                                    Priority
                                    {sort === 'priority' && (
                                        direction === 'asc' ? " ▲" : " ▼"
                                    )}
                                </th>
                                <th className="py-3 cursor-pointer"

                                    onClick={() => sortBy('status')}
                                >
                                    Status
                                    {sort === 'status' && (
                                        direction === 'asc' ? " ▲" : " ▼"
                                    )}
                                </th>
                                <th className="py-3">Response</th>
                            </tr>
                        </thead>

                        <tbody>
                            {tickets.data.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="8"
                                        className="text-center py-10 text-gray-500"
                                    >
                                        No tickets found.
                                    </td>
                                </tr>
                            ) : (
                                tickets.data.map((ticket, index) => (
                                    <motion.tr
                                        key={ticket.id}
                                        onClick={() => window.location.href = route("admin.customer.support.show", ticket.id)}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        className={`border-b hover:bg-gray-50 transition cursor-pointer relative ${ticket.admin_read_at === null ? "bg-yellow-50  hover:bg-yellow-100" : ""}`}
                                    >
                                        {ticket.admin_read_at === null && (
                                            <>
                                                <span className="absolute left-1 top-2 w-[10px] h-[10px] bg-blue-500 rounded-full"></span>
                                            </>
                                        )}
                                        {/* User Info */}
                                        <td className="py-3 flex items-center gap-2">
                                            <img
                                                src={`/storage/${ticket.supportable.avatar || "storage/profile/default-avatar.png"}`}
                                                alt={ticket.supportable.name}
                                                className="w-8 h-8 rounded-full object-cover"
                                            />
                                            <div>
                                                <p className="font-medium">{ticket.supportable.name}</p>
                                                <p className="text-xs text-gray-500">{ticket.supportable.email}</p>
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
                    <div className="flex justify-center mt-4">
                        {tickets.links.map((link, index) => (
                            <button
                                key={index}
                                disabled={!link.url}
                                onClick={() => link.url && router.get(link.url)}
                                className={`px-3 py-1 mx-1 rounded 
                ${link.active ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-700"}
                ${!link.url ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-200"}
            `}
                            >
                                <span dangerouslySetInnerHTML={{ __html: link.label }} />
                            </button>
                        ))}
                    </div>

                </div>
            </motion.div>
        </AuthenticatedLayout>
    );
}
