import Sidebar from './Sidebar';
import { usePage, Link } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import AdminNotifModal from '@/Components/AdminNotifModal';
import Footer from '@/Components/Footer';
import PopupNotif from '@/Components/Notifications/Owner/PopupNotif';
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
export default function AuthenticatedLayout({ children }) {
    const user = usePage().props.auth.user;
    // console.log(user.notifications);
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
        axios.get("/admin/notification/count").then((res) => {
            setNotificationsCount(res.data.count);
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
            <PopupNotif notification={notifVisible} onClose={() => setNotifVisible(null)} />

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

                    <div className="flex items-center z-50 space-x-4">

                        {/* Notifications Dropdown */}
                        <div className="relative group">
                            {notificationsCount > 0 && (
                                <div className="absolute -top-1.5 -right-1.5 h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                                    {notificationsCount > 9 ? "+9" : notificationsCount}
                                </div>
                            )}
                            <button
                                onClick={() => setNotificationsModal(!notificationsModal)}
                                className="p-2 flex items-center justify-center w-10 h-10">

                                <FontAwesomeIcon icon={faBell} className="h-5 w-5 text-white" />
                            </button>
                            {notificationsModal && <AdminNotifModal />}
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
