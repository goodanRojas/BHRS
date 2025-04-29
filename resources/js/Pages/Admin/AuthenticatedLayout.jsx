import Sidebar from './Sidebar';
import { usePage } from '@inertiajs/react';
import { useState } from 'react';
import Dropdown from '@/Components/Dropdown';
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function AdminLayout({ children }) {
    const user = usePage().props.auth.user;

    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} />

            {/* Main Content */}
            <div className="flex-1 flex flex-col">
                {/* Top Navbar */}
                <header className="flex items-center justify-between bg-white shadow px-6 py-4">
                    <div>
                        <div className="flex items-center space-x-4">
                            {/* Sidebar Toggle Button */}
                            <button
                                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                className="text-gray-600 hover:text-gray-800"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                  
                    </div>

                    <div className="flex items-center space-x-4">

                        {/* Notifications Dropdown */}
                        <div className="relative group">
                            {user?.notifications?.length > 0 && (
                                <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold shadow-md">
                                    {user.notifications.length}
                                </div>
                            )}

                            <Dropdown>
                                <Dropdown.Trigger>
                                    <div
                                        className="relative inline-flex items-center justify-center p-2 text-gray-600 cursor-pointer hover:scale-105 transition-transform duration-200"
                                        onMouseEnter={() => setNotificationsModal(true)}
                                        onClick={() => setNotificationsModal(true)}
                                    >
                                        <FontAwesomeIcon
                                            icon={faBell}
                                            className="h-6 w-6 text-yellow-400 hover:text-yellow-500 focus:outline-none"
                                        />
                                    </div>
                                </Dropdown.Trigger>

                                <Dropdown.Content className="w-64 bg-white shadow-lg rounded-lg border border-gray-200">
                                    {user?.notifications?.length > 0 ? (
                                        user.notifications.map((notification, index) => (
                                            <div key={index} className="border-b last:border-none border-gray-200 p-3 hover:bg-gray-100 cursor-pointer transition">
                                                <Link
                                                    href={`/notification/mark-as-read/${notification.data.message.id}/${notification.id}`}
                                                    className="flex flex-col"
                                                >
                                                    <p className="text-sm font-semibold text-gray-800">{notification.data.message.title}</p>
                                                    <p className="text-xs text-gray-600 mt-1">{notification.data.message.message}</p>
                                                </Link>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="p-3 text-sm text-gray-500 text-center">No new notifications</p>
                                    )}
                                </Dropdown.Content>
                            </Dropdown>

                            <span className="absolute left-1/2 top-8 translate-y-2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform duration-200 bg-gray-800 text-white text-xs rounded py-1 px-2 shadow-md">
                                Notifications
                            </span>
                        </div>

                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-y-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}
