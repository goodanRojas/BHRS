import SellerLayout from "@/Layouts/SellerLayout";
import { Head, router } from "@inertiajs/react";
import { useState, useRef, useMemo, useEffect } from "react";
import { motion } from "framer-motion";
import { Bell, CheckCircle2, Trash2, Clock, Mail, MailOpen } from "lucide-react";
import Modal from "@/Components/Modal";

export default function Index({ notifications, highlight }) {
    const [list, setList] = useState(notifications);
    const [showUnread, setShowUnread] = useState(true);
    const [deleteId, setDeleteId] = useState(null);
    const [deleteAll, setDeleteAll] = useState(false);

    const unread = useMemo(() => list.filter(n => n.read_at === null), [list]);
    const read = useMemo(() => list.filter(n => n.read_at !== null), [list]);
    const currentList = showUnread ? unread : read;

    const itemsRefs = useRef({});
    const [highlightedId, setHighlightedId] = useState(highlight);

    useEffect(() => {
        if (highlightedId && itemsRefs.current[highlightedId]) {
            itemsRefs.current[highlightedId].scrollIntoView({ behavior: 'smooth', block: "center" });
            const timer = setTimeout(() => {
                setHighlightedId(null);
            }, 3000);

            return () => {
                clearTimeout(timer);
            };
        }
    }, [highlightedId]);

    // Mark all as read
    const markAllAsRead = () => {
        router.post(route("seller.notifications.markAllRead"), {}, {
            onSuccess: () => {
                setList(prev => prev.map(n => ({ ...n, read_at: new Date().toISOString() })));
            }
        });
    };

    // Mark single notification as read
    const markAsRead = (id) => {
        router.post(route("seller.notifications.markAsRead", id), {}, {
            onSuccess: () => {
                setList(prev =>
                    prev.map(n => n.id === id ? { ...n, read_at: new Date().toISOString() } : n)
                );
            }
        });
    };

    // Delete single notification
    const confirmDelete = (id) => {
        setDeleteId(id);
    };

    const handleDelete = () => {
        router.delete(route("seller.notifications.destroy", deleteId), {
            onSuccess: () => {
                setList(prev => prev.filter(n => n.id !== deleteId));
                setDeleteId(null);
            }
        });
    };

    // Delete all notifications (depending on tab)
    const confirmDeleteAll = () => {
        setDeleteAll(true);
    };

    const handleDeleteAll = () => {
        const type = showUnread ? "unread" : "read";
        router.delete(route("seller.notifications.destroyAll", { type }), {
            onSuccess: () => {
                setList(prev => prev.filter(n => (showUnread ? n.read_at !== null : n.read_at === null)));
                setDeleteAll(false);
            }
        });
    };


    const renderItem = (n) => (
        <motion.li
            key={n.id}
            ref={(el) => (itemsRefs.current[n.id] = el)}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
            className={`relative flex justify-between items-start p-5 rounded-xl shadow-sm border 
      ${highlightedId == n.id ? "bg-yellow-50 ring-2 ring-yellow-300" : "bg-white"}
    `}
        >
            {/* Icon + Content */}
            <div className="flex gap-3 flex-1">
                <div className="flex-shrink-0 mt-1">
                    <Bell className="h-6 w-6 text-indigo-500" />
                </div>

                <div className="flex-1">
                    <div>
                        <h1 className="font-semibold text-lg text-gray-900">{n.data.title}</h1>
                        <p className="text-sm text-gray-700">{n.data.message}</p>
                    </div>

                    {/* Meta Data */}
                    {n.data.meta && (
                        <div className="mt-2 space-y-1">
                            {Object.entries(n.data.meta).map(([key, value]) => (
                                <p key={key} className="text-xs text-gray-600 flex items-center gap-1">
                                    <Clock className="h-3 w-3 text-gray-400" />
                                    <span className="font-medium capitalize">
                                        {key.replace(/_/g, " ")}:
                                    </span>{" "}
                                    {value == null ? (
                                        <span className="italic text-gray-400">N/A</span>
                                    ) : typeof value === "string" && value.includes("T") ? (
                                        new Date(value).toLocaleString("en-US", {
                                            year: "numeric",
                                            month: "short",
                                            day: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                        })
                                    ) : (
                                        value.toString()
                                    )}
                                </p>
                            ))}

                        </div>
                    )}

                    {/* Timestamp */}
                    <p className="text-xs text-gray-400 mt-2 flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(n.created_at).toLocaleString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "2-digit",
                            hour: "2-digit",
                            minute: "2-digit",
                        })}
                    </p>
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-2 ml-4 z-10">
                {n.read_at === null && (
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => markAsRead(n.id)}
                        className="p-2 rounded-full bg-green-100 text-green-600 hover:bg-green-200"
                        title="Mark as read"
                    >
                        <CheckCircle2 className="h-5 w-5" />
                    </motion.button>
                )}
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => confirmDelete(n.id)}
                    className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200"
                    title="Delete"
                >
                    <Trash2 className="h-5 w-5" />
                </motion.button>
            </div>

            {/* Overlay if already read */}
            {n.read_at && (
                <div className="absolute inset-0 bg-black/5 rounded-xl pointer-events-none"></div>
            )}
        </motion.li>
    );
    return (<SellerLayout>
        <Head title="Notifications" />

        <div className="p-8 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                    <Bell className="w-7 h-7 text-indigo-600" />
                    <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                </div>

                <div className="flex gap-2">
                    {showUnread && unread.length > 0 && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={markAllAsRead}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 text-white text-sm rounded-md shadow-sm hover:bg-indigo-700 transition"
                        >
                            <CheckCircle2 className="w-4 h-4" />
                            Mark all as read
                        </motion.button>
                    )}

                    {currentList.length > 0 && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={confirmDeleteAll}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white text-sm rounded-md shadow-sm hover:bg-red-700 transition"
                        >
                            <Trash2 className="w-4 h-4" />
                            Delete all
                        </motion.button>
                    )}
                </div>
            </div>

            {/* Toggle buttons */}
            <div className="flex gap-3 mb-6">
                <button
                    onClick={() => setShowUnread(true)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm transition-all duration-200 
      ${showUnread
                            ? "bg-indigo-600 text-white shadow-md scale-105"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    <Mail className="w-4 h-4" />
                    Unread ({unread.length})
                </button>

                <button
                    onClick={() => setShowUnread(false)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium shadow-sm transition-all duration-200 
      ${!showUnread
                            ? "bg-indigo-600 text-white shadow-md scale-105"
                            : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        }`}
                >
                    <MailOpen className="w-4 h-4" />
                    Read ({read.length})
                </button>
            </div>
            {/* Notifications List */}
            {currentList.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm p-8 text-center text-gray-500">
                    {showUnread ? "No unread notifications." : "No read notifications."}
                </div>
            ) : (
                <ul className="space-y-4">
                    {currentList.map((n) => renderItem(n))}
                </ul>
            )}
        </div>

        {/* Delete single confirmation modal */}
        <Modal show={!!deleteId} onClose={() => setDeleteId(null)}>
            <div className="p-6">
                <h2 className="text-lg font-bold mb-2">Delete Notification</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Are you sure you want to delete this notification?
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setDeleteId(null)}
                        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </Modal>

        {/* Delete all confirmation modal */}
        <Modal show={deleteAll} onClose={() => setDeleteAll(false)}>
            <div className="p-6">
                <h2 className="text-lg font-bold mb-2">Delete All Notifications</h2>
                <p className="text-sm text-gray-600 mb-4">
                    Are you sure you want to delete all{" "}
                    {showUnread ? "unread" : "read"} notifications?
                </p>
                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setDeleteAll(false)}
                        className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleDeleteAll}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                    >
                        Delete All
                    </button>
                </div>
            </div>
        </Modal>
    </SellerLayout>

    );
}
