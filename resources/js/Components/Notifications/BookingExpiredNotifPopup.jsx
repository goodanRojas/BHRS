import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faTimes } from "@fortawesome/free-solid-svg-icons";

export default function BookingExpiredNotifPopup({ notification, onClose }) {

   

    return (
        <AnimatePresence>
            {notification && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="fixed top-4 right-4 bg-white shadow-lg rounded-xl p-4 w-80 border border-gray-200 z-50"
                >
                    {/* Header with Close Button */}
                    <div className="flex justify-between items-center mb-2">
                        
                        <h2 className="text-gray-800 font-semibold">Booking Expired</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600"
                        >
                            <FontAwesomeIcon icon={faTimes} className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="flex items-center gap-3">
                        <FontAwesomeIcon icon={faBell} className="text-gray-500 h-6 w-6" />
                        <div>
                            <p className="text-sm text-gray-600">
                                booked {notification.bed_name} in{" "}
                                {notification.room_name}, {notification.building_name}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                Start: {notification.start_date} •{" "}
                                {notification.month_count} months
                            </p>
                        </div>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
