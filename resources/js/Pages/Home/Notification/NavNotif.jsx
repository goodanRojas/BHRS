import React, { useEffect, useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link } from '@inertiajs/inertia-react';

const NavNotif = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get('/notifications/latest');
                setNotifications(response.data.notifications); // assuming `notifications` key
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    return (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-50 p-4">
            <h3 className="text-gray-800 font-semibold mb-2">Notifications</h3>

            {loading ? (
                <div className="text-sm text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
                <div className="text-sm text-gray-500">No new notifications.</div>
            ) : (
                <ul className="max-h-60 overflow-y-auto">
                    {notifications.map((notif) => (
                        <li key={notif.id} className="p-2 border-b last:border-none">
                            <div className="text-sm text-gray-700">{notif.data.message}</div>
                            <div className="text-xs text-gray-400">{notif.created_at}</div>
                        </li>
                    ))}
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
