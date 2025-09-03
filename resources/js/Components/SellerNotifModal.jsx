import React, { useEffect, useState } from 'react';
import { Inertia } from '@inertiajs/inertia';
import { Link } from '@inertiajs/inertia-react';

const NavNotif = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const maxToShow = 5; // number of notifications to display initially

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axios.get('/seller/notifications/latest');
                setNotifications(response.data.notifications); // assuming `notifications` key
            } catch (error) {
                console.error('Error fetching notifications:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNotifications();
    }, []);

    const displayed = notifications.slice(0, maxToShow);
    let remainingCount = notifications.length - maxToShow;
    if(remainingCount > 9)
    {
        remainingCount = 9;
    }

    return (
        <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg z-50 p-4">
            <h3 className="text-gray-800 font-semibold mb-2">Notifications</h3>

            {loading ? (
                <div className="text-sm text-gray-500">Loading...</div>
            ) : notifications.length === 0 ? (
                <div className="text-sm text-gray-500">No new notifications.</div>
            ) : (
                <ul className="max-h-60 overflow-y-auto">
                    {displayed.map((notif) => (
                        <li
                            key={notif.id}
                            className="flex items-center gap-3 p-3 border-b last:border-none hover:bg-gray-50 transition"
                        >
                            {notif.image ? (
                                <img
                                    src={`/storage/${notif.image}`}
                                    alt="User"
                                    className="w-10 h-10 rounded-full object-cover border"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                                    ?
                                </div>
                            )}

                            <div className="flex flex-col">
                                <p className="text-sm text-gray-700 leading-snug">{notif.message}</p>
                                <span className="text-xs text-gray-400">{notif.created_at}</span>
                            </div>
                        </li>
                    ))}

                    {remainingCount > 0 && (
                        <li className="text-center text-xs text-gray-500 py-2">
                            +{remainingCount} more
                        </li>
                    )}
                </ul>
            )}

            <div className="mt-2 text-right">
                <Link
                    href={route('seller.notifications.index')}
                    className="text-blue-500 hover:underline text-sm"
                >
                    See all
                </Link>
            </div>
        </div>
    );
};

export default NavNotif;
