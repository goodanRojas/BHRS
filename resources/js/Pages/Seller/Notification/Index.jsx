import SellerLayout from "@/Layouts/SellerLayout";
import { Head, router, } from "@inertiajs/react";
import { useState, useRef, useEffect, useMemo } from "react";
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
        <li
            key={n.id}
            ref={(el) => (itemsRefs.current[n.id] = el)}
            className={`relative flex justify-between items-start p-4 border-b rounded 
                ${highlightedId == n.id ? "bg-slate-300 animate-pulse" : ""}`}
        >
            <div className="flex-1">
                <p className="font-medium">
                    Booking for <span className="text-indigo-600">{n.data.bed_name}</span>
                    in {n.data.room_name}, {n.data.building_name} has expired.
                </p>
                <p className="text-sm text-gray-500">
                    {new Date(n.created_at).toLocaleString()}
                </p>
            </div>

            <div className="flex gap-2 ml-4 z-10">
                {n.read_at === null && (
                    <button
                        onClick={() => markAsRead(n.id)}
                        className="text-green-600 hover:text-green-800 text-sm"
                    >
                        Mark as read
                    </button>
                )}
                <button
                    onClick={() => confirmDelete(n.id)}
                    className="text-red-500 hover:text-red-700 text-sm"
                >
                    Delete
                </button>
            </div>

            {/* Overlay for read */}
            {n.read_at && (
                <div className="absolute inset-0 bg-black/20 rounded"></div>
            )}
        </li>
    );

    return (
        <SellerLayout>
            <Head title="Notifications" />

            <div className="p-6 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Notifications</h1>
                    <div className="flex gap-2">
                        {showUnread && unread.length > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
                            >
                                Mark all as read
                            </button>
                        )}
                        {currentList.length > 0 && (
                            <button
                                onClick={confirmDeleteAll}
                                className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                            >
                                Delete all
                            </button>
                        )}
                    </div>
                </div>

                {/* Toggle buttons */}
                <div className="flex gap-2 mb-4">
                    <button
                        onClick={() => setShowUnread(true)}
                        className={`px-3 py-1 rounded-lg ${showUnread ? "bg-indigo-600 text-white" : "bg-gray-200"}`}
                    >
                        Unread ({unread.length})
                    </button>
                    <button
                        onClick={() => setShowUnread(false)}
                        className={`px-3 py-1 rounded-lg ${!showUnread ? "bg-indigo-600 text-white" : "bg-gray-200"}`}
                    >
                        Read ({read.length})
                    </button>
                </div>

                {currentList.length === 0 ? (
                    <p className="text-gray-500">{showUnread ? "No unread notifications." : "No read notifications."}</p>
                ) : (
                    <ul className="divide-y divide-gray-200">
                        {currentList.map((n) => renderItem(n))}
                    </ul>
                )}
            </div>

            {/* Delete single confirmation modal */}
            <Modal show={!!deleteId} onClose={() => setDeleteId(null)}>
                <div className="p-6">
                    <h2 className="text-lg font-bold mb-2">Delete Notification</h2>
                    <p className="text-sm text-gray-600 mb-4">Are you sure you want to delete this notification?</p>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setDeleteId(null)}
                            className="px-3 py-1 bg-gray-300 rounded-lg hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDelete}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
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
                    <p className="text-sm text-gray-600 mb-4">Are you sure you want to delete all {showUnread ? "unread" : "read"} notifications?</p>
                    <div className="flex justify-end gap-2">
                        <button
                            onClick={() => setDeleteAll(false)}
                            className="px-3 py-1 bg-gray-300 rounded-lg hover:bg-gray-400"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleDeleteAll}
                            className="px-3 py-1 bg-red-600 text-white rounded-lg hover:bg-red-700"
                        >
                            Delete All
                        </button>
                    </div>
                </div>
            </Modal>
        </SellerLayout>
    );
}
