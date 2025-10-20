import React, { useEffect, useState } from "react";
import { Link } from "@inertiajs/inertia-react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, CheckCircle, AlertCircle, Calendar } from "lucide-react";

const AdminNotifModal = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const maxToShow = 5;

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await axios.get("/admin/notification/latest");
        setNotifications(response.data.notifications || []);
      } catch (error) {
        console.error("Error fetching notifications:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const displayed = notifications.slice(0, maxToShow);
  let remainingCount = notifications.length - maxToShow;
  if (remainingCount > 9) {
    remainingCount = 9;
  }

  // Choose an icon depending on title/type
  const getIcon = (notif) => {
    if (notif.title?.toLowerCase().includes("booking")) return <Calendar className="h-5 w-5 text-blue-500" />;
    if (notif.title?.toLowerCase().includes("approved")) return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (notif.title?.toLowerCase().includes("expired")) return <AlertCircle className="h-5 w-5 text-red-500" />;
    return <Bell className="h-5 w-5 text-gray-400" />;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.2 }}
      className="absolute right-0 mt-2 w-80 bg-white shadow-xl rounded-2xl z-[9999] p-4 border border-gray-200"
    >
      <h3 className="text-gray-900 font-semibold mb-3 flex items-center gap-2">
        <Bell className="h-5 w-5 text-indigo-500" />
        Notifications
      </h3>

      {loading ? (
        <div className="text-sm text-gray-500">Loading...</div>
      ) : notifications.length === 0 ? (
        <div className="text-sm text-gray-500">No new notifications.</div>
      ) : (
        <ul className="max-h-64 overflow-y-auto divide-y divide-gray-100">
          <AnimatePresence>
            {displayed.map((notif) => (
              <motion.li
                key={notif.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="hover:bg-gray-50 rounded-lg transition cursor-pointer"
              >
                <Link
                  href={notif.link || route("seller.notifications.index", { highlight: notif.id })}
                  className="flex items-start gap-3 p-3"
                >
                  <div className="flex-shrink-0">
                    {notif.image ? (
                      <img
                        src={`/storage/${notif.image}`}
                        alt="User"
                        className="w-10 h-10 rounded-full object-cover border shadow-sm"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                        {getIcon(notif)}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col flex-1">
                    <p className="text-sm text-gray-900 font-medium">{notif.title}</p>
                    <p className="text-sm text-gray-600 leading-snug">{notif.message}</p>
                    <span className="text-xs text-gray-400 mt-1">{notif.created_at}</span>
                  </div>
                </Link>
              </motion.li>
            ))}
          </AnimatePresence>

          {remainingCount > 0 && (
            <li className="text-center text-xs text-gray-500 py-2">+{remainingCount} more</li>
          )}
        </ul>
      )}

      <div className="mt-3 text-right">
        <Link
          href={route("admin.notification.index")}
          className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
        >
          See all →
        </Link>
      </div>
    </motion.div>
  );
};

export default AdminNotifModal;
