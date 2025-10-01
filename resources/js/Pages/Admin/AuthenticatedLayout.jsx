import Sidebar from './Sidebar';
import { usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Dropdown from '@/Components/Dropdown';
import Footer from '@/Components/Footer';
import NotifPopUp from '@/Components/Notifications/Admin/NotifPopUp';
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function AuthenticatedLayout({ children }) {
    const user = usePage().props.auth.user;
    const [notificationsModal, setNotificationsModal] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [notificationsCount, setNotificationsCount] = useState(0);
    const [notifVisible, setNotifVisible] = useState(null);
    useEffect(() => {
        window.Echo.private(`App.Models.Admin.${user?.id}`)
            .notification((notification) => {
                console.log(notification);
                setNotifVisible(notification);
                setNotificationsCount(notificationsCount + 1);
            });


    }, [user?.id]);
    // Load from sessionStorage on first render
    useEffect(() => {
        const savedSidebarState = sessionStorage.getItem("sidebarState");
        if (savedSidebarState) {
            const state = JSON.parse(savedSidebarState);
            setIsSidebarOpen(state.isOpen);
        }
    }, []);

    // Save when sidebar changes
    useEffect(() => {
        sessionStorage.setItem("sidebarState", JSON.stringify({ isOpen: isSidebarOpen }));
    }, [isSidebarOpen]);
    return (
        <div className="flex min-h-screen w-full ">
            <NotifPopUp notification={notifVisible} onClose={() => setNotifVisible(null)} />

            <div
                className="fixed -z-10 top-0 left-0 w-screen h-screen bg-gradient-to-br from-gray-100 via-blue-200 to-gray-300"
            >

            </div>
            {/* Sidebar */}
            <Sidebar className={"flex-shrink-0"} isOpen={isSidebarOpen} onToggle={() => setIsSidebarOpen(!isSidebarOpen)} />

            {/* Main Content */}
            <div className={`${isSidebarOpen ? "ml-64" : "ml-16"} flex-grow flex flex-col`}>
                {/* Top Navbar */}
                <header className="flex items-center justify-between  bg-blue-900 bg-opacity-80 backdrop-blur-md shadow-md px-6 h-10">

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
                                            className="h-4 w-4 text-slate-100 hover:text-yellow-500 focus:outline-none"
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
                <div className="flex-1 flex flex-col min-w-0">
                    <main className="flex-1 p-6 overflow-auto min-w-0">
                        {children}
                    </main>
                </div>

                <Footer className="" />
                {/* Footer */}
            </div>
        </div>
    );
}
