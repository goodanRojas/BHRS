import SellerLayout from "@/Layouts/SellerLayout";
import { motion, AnimatePresence } from "framer-motion";
import { PlusCircle, X, Paperclip, AlertTriangle } from "lucide-react";
import { Head, useForm, usePage } from "@inertiajs/react";
import { useState, useEffect } from "react";
import Modal from "@/Components/Modal";
import Toast from "@/Components/Toast";

export default function Index({ tickets: initialTickets = [] }) {

    const props = usePage().props;

    const owner = usePage().props.auth.seller;

    const [open, setOpen] = useState(false);
    const [tickets, setTickets] = useState(initialTickets);
    const [toast, setToast] = useState({
        isTrue: false,
        message: "",
        isType: "",
        id: null,
    });
    const { data, setData, post, processing, reset } = useForm({
        email: "",
        name: "",
        category: "",
        message: "",
        attachment: null,
    });

    const submitForm = (e) => {
        e.preventDefault();

        post(route("seller.customer.support.store"), {
            forceFormData: true,
            onSuccess: (page) => {
                reset();
                setOpen(false);
                const newTicket = page.props.tickets[0];
                setTickets((tickets) => [newTicket, ...tickets]);
                setToast({
                    isTrue: true,
                    message: "New ticket created successfully.",
                    isType: "success",
                    id: Date.now(),
                })
            },
            onError: (errors) => {
                console.log(errors);
            }
        });
    };

    useEffect(() => {
        const channel = Echo.private(`customer-support-response-channel.seller.${owner?.id}`)
            .listen('.CustomerSupportResponseEvent', (e) => {
                setTickets((tickets) => {
                    const exists = tickets.some((t) => t.id === e.ticket.id);
                    if (exists) {
                        return tickets.map((t) =>
                            t.id === e.ticket.id ? e.ticket : t
                        );
                    }

                    return [e.ticket, ...tickets];
                });
                setToast({
                    isTrue: true,
                    message: "New response received for your support ticket.",
                    isType: "success",
                    id: Date.now(),
                });

            });

        return () => {
            Echo.leave('customer-support-response-channel');
        }
    }, [owner?.id]);

    return (
        <SellerLayout>
            <Head title="Customer Support" />

            {toast.isTrue && (
                <Toast
                    isTrue={toast.isTrue}
                    message={toast.message}
                    isType={toast.isType}
                    id={toast.id}
                />
            )}
            <div className="p-6">

                {/* Header */}
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-gray-800">
                        Customer Support
                    </h1>

                    <button
                        onClick={() => setOpen(true)}
                        className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition"
                    >
                        <PlusCircle size={20} />
                        Compose
                    </button>
                </div>

                {/* Modal */}
                <AnimatePresence>
                    {open && (
                        <Modal show={open} onClose={() => setOpen(false)}>
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                            >
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-semibold">
                                        Submit Support Request
                                    </h2>
                                    <button onClick={() => setOpen(false)}>
                                        <X size={24} className="text-gray-600 hover:text-black" />
                                    </button>
                                </div>

                                <div className="flex items-center gap-2 mb-4 text-yellow-700 bg-yellow-100 px-4 py-2 rounded-lg">
                                    <span> <AlertTriangle size={18} />
                                        Please note that once you submit your support request, it will not be deleted</span>
                                </div>

                                {/* Form */}
                                <form onSubmit={submitForm} className="space-y-4">

                                    <div>
                                        <label className="block font-medium">Email</label>
                                        <input
                                            type="email"
                                            className="w-full p-3 border rounded-lg"
                                            placeholder="e.g. your@email.com"
                                            value={data.email}
                                            onChange={(e) => setData("email", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-medium">Name</label>
                                        <input
                                            type="text"
                                            className="w-full p-3 border rounded-lg"
                                            value={data.name}
                                            onChange={(e) => setData("name", e.target.value)}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-medium">Category <span className="text-gray-400">(optional)</span></label>
                                        <input
                                            className="w-full p-3 border rounded-lg"
                                            type="text"
                                            placeholder="e.g., UI/UX, Billing, Booking"
                                            value={data.category}
                                            onChange={(e) => setData("category", e.target.value)}
                                        />
                                    </div>

                                    <div>
                                        <label className="block font-medium">Message</label>
                                        <textarea
                                            className="w-full p-3 border rounded-lg"
                                            placeholder="Leave your message here."
                                            rows="4"
                                            value={data.message}
                                            onChange={(e) => setData("message", e.target.value)}
                                            required
                                        ></textarea>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="block font-medium text-gray-700">Attachment <span className="text-gray-400">(optional)</span></label>

                                        <label
                                            htmlFor="attachment"
                                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-blue-400 transition bg-gray-50"
                                        >
                                            <div className="flex flex-col items-center">
                                                <Paperclip className="text-gray-500 mb-2" size={28} />
                                                <span className="text-gray-600 text-sm">
                                                    Click to upload or drag & drop file
                                                </span>
                                                <span className="text-gray-400 text-xs mt-1">
                                                    Supported: JPG, PNG, PDF, DOCX
                                                </span>
                                            </div>

                                            <input
                                                id="attachment"
                                                type="file"
                                                className="hidden"
                                                onChange={(e) => setData("attachment", e.target.files[0])}
                                            />
                                        </label>

                                        {/* Display selected filename */}
                                        {data.attachment && (
                                            <p className="text-sm text-green-600 mt-1">
                                                Selected: <span className="font-medium">{data.attachment.name}</span>
                                            </p>
                                        )}
                                    </div>


                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition"
                                    >
                                        Submit
                                    </button>
                                </form>
                            </motion.div>
                        </Modal>

                    )}
                </AnimatePresence>

                {/* Tickets Table */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white p-4 rounded-xl shadow mt-6 overflow-x-auto "
                >
                    <table className="w-full text-left min-w-[500px]">
                        <thead>
                            <tr className="border-b text-gray-600">
                                <th className="py-3">Category</th>
                                <th className="py-3">Message</th>
                                <th className="py-3">Attachment</th>
                                <th className="py-3">Response</th>
                                <th className="py-3">Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {tickets.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="5"
                                        className="text-center py-10 text-gray-500"
                                    >
                                        No support requests yet.
                                    </td>
                                </tr>
                            ) : (
                                tickets.map((ticket, index) => (
                                    <motion.tr
                                        key={ticket.id}
                                        onClick={() => window.location.href = route("seller.customer.support.show", ticket.id)}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.03 }}
                                        className="border-b cursor-pointer hover:bg-gray-50"
                                    >
                                        <td className="py-3 capitalize">
                                            {ticket.category}
                                        </td>

                                        <td className="py-3">{ticket.message}</td>

                                        <td className="py-3">
                                            {ticket.attachment ? (
                                                <>
                                                    <Paperclip size={16} />
                                                </>

                                            ) : (
                                                <span className="text-gray-400">None</span>
                                            )}
                                        </td>

                                        <td className="py-3">
                                            {ticket.response ? (
                                                <span className="text-green-700">
                                                    {ticket.response}
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">No response yet</span>
                                            )}
                                        </td>

                                        <td className="py-3">
                                            <span
                                                className={`px-3 py-1 rounded-full text-xs ${ticket.status === "open"
                                                    ? "bg-blue-100 text-blue-600"
                                                    : ticket.status === "in_progress"
                                                        ? "bg-yellow-100 text-yellow-600"
                                                        : "bg-green-100 text-green-600"
                                                    }`}
                                            >
                                                {ticket.status}
                                            </span>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </motion.div>
            </div>
        </SellerLayout>
    );
}
