import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function PopupNotif({ notification, onClose }) {
    if (!notification) return null;

    let formattedDate = null;
    if (notification.meta?.start_date) {
        try {
            formattedDate = new Intl.DateTimeFormat("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric",
            }).format(new Date(notification.meta.start_date));
        } catch {}
    }

    const handleClick = () => {
        if (notification.link) {
            window.location.href = notification.link;
        }
    };

    return (
        <AnimatePresence>
            {notification && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    onClick={handleClick}
                    className="fixed top-4 right-4 bg-white shadow-lg rounded-xl p-4 w-80 border border-gray-200 z-50 cursor-pointer"
                >
                    {/* Header with Close Button */}
                    <div className="flex justify-between items-center mb-2">
                        <h2 className="text-gray-800 font-semibold">{notification.title}</h2>
                        <button
                            onClick={(e) => {
                                e.stopPropagation(); // prevent redirect if clicking close
                                onClose();
                            }}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                        </button>
                    </div>

                    {/* Body */}
                    <div className="flex items-start gap-3">
                        <FontAwesomeIcon icon={faBell} className="text-gray-500 h-6 w-6 mt-1" />
                        <div>
                            <p className="text-sm text-gray-600">{notification.message}</p>

                            {notification.meta && (
                                <>
                                    {notification.meta.bed_name && (
                                        <p className="text-sm text-gray-600 mt-1">
                                            {notification.meta.bed_name} in {notification.meta.room_name},{" "}
                                            {notification.meta.building_name}
                                        </p>
                                    )}
                                    {formattedDate && (
                                        <p className="text-xs text-gray-400 mt-1">
                                            Start: {formattedDate} • {notification.meta.month_count} month
                                            {notification.meta.month_count > 1 ? "s" : ""}
                                        </p>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
