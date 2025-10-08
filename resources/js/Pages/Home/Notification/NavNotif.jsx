import React, { useEffect, useState } from 'react';
import { Link } from '@inertiajs/inertia-react';
import axios from 'axios';

const NavNotif = () => {
    const [notifications, setNotifications] = useState([]); // Set of notifications
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get('/notifications/latest');
                // Instead of querying the raw data, we'll parse it into a more usable format
                // Such as name, date, description and type.
                setNotifications(response.data.notifications);
                console.log(response.data.notifications);
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const displayedNotifs = notifications.slice(0, 5);
    let remainingCount = notifications.length - 5;
    if (remainingCount > 9) remainingCount = 9;

    // Map notification type to a user-friendly name
    const getNotificationType = (type) => {
        switch (type) {
            case "App\\Notifications\\User\\BookingSetupCompleted":
                return "Booking Setup Completed";
            case "App\\Notifications\\User\\BookingApprovedNotif":
                return "Booking Approved";
            case "App\\Notifications\\User\\BookingExpiredNotify":
                return "Booking Expired";
            default:
                return "Unknown";
        }
    };

    // Format timestamp nicely
    const formatDate = (timestamp) => {
        return new Intl.DateTimeFormat("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        }).format(new Date(timestamp));
    };

    return (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-50 p-4">
            <h3 className="text-gray-800 font-semibold mb-2">Notifications</h3>

            {loading ? (
                <div className="text-sm text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
                <div className="text-sm text-gray-500">No new notifications.</div>
            ) : (
                <ul className="max-h-60 overflow-y-auto">
                    {displayedNotifs.map((notif) => {
                        const type = getNotificationType(notif.type);
                        const date = formatDate(notif.created_at);

                        return (
                            <li key={notif.id} className="p-2 border-b last:border-none">
                                <Link
                                    href={route('notifications.index', { highlight: notif.id })}
                                    className="block text-sm text-gray-700 hover:bg-gray-100 rounded p-2"
                                >
                                    <div className="font-semibold">{getNotificationType(notif.type)}:</div>
                                    <div>{notif.data.message}</div>
                                    <div className="text-xs text-gray-400">{formatDate(notif.created_at)}</div>
                                </Link> </li>
                        );
                    })}
                    {remainingCount > 0 && (
                        <li className="text-center text-xs text-gray-500 py-2">
                            +{remainingCount} more
                        </li>
                    )}
                </ul>
            )}

            <div className="mt-2 text-right">
                <Link
                    href={route('notifications.index')}
                    className="text-blue-500 hover:underline text-sm"
                >
                    See all
                </Link>
            </div>
        </div>
    );
};

export default NavNotif;
