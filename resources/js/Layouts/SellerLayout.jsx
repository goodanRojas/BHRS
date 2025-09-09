import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Footer from '@/Components/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faBell, faBars, faTimes } from '@fortawesome/free-solid-svg-icons';
import SellerNotifModal from '@/Components/SellerNotifModal';
import BookingNotif from '@/Components/Notifications/Owner/BookingNotif';
import axios from 'axios';

export default function SellerLayout({ header, children }) {
    const user = usePage().props.auth.seller;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [messagesCount, setMessagesCount] = useState(0);

    /* Notification States */
    const [notificationsModal, setNotificationsModal] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [notifVisiblt, setNotifVisible] = useState(null);
    const [notificationsCount, setNotificationsCount] = useState(0);

    // Listen for new notifications
    useEffect(() => {
        window.Echo.private(`App.Models.Seller.${user.id}`)
            .notification((notification) => {
                setNotifications((prev) => [notification, ...prev]);
                setNotifVisible(notification);
                setNotificationsCount(prevCount => prevCount + 1);
            });
    }, [user?.id]);

    useEffect(() => {
        axios.get("/seller/notifications/count").then((res) => {
            setNotificationsCount(res.data.count);
        });
    }, [user?.id]);

    return (
        <div className="min-h-screen">
            <BookingNotif notification={notifVisiblt} onClose={() => setNotifVisible(null)} />

            {/* Background Image */}
            <div
                className="fixed top-0 left-0 h-screen bg-cover bg-center bg-no-repeat -z-10"
                style={{ backgroundImage: "url('/storage/system/background/background.webp')" }}
            ></div>

            {/* Navbar */}
            <nav className="border-b border-gray-700 bg-gray-900 shadow-lg">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between items-center">
                        {/* Left Section */}
                        <div className="flex items-center">
                            {/* Logo */}
                            <Link href="/" className="flex items-center">
                                <ApplicationLogo className="block h-9 w-auto fill-current text-white" />
                            </Link>

                            {/* Desktop Nav Links */}
                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('seller.dashboard.index')}
                                    active={route().current('seller.dashboard.index')}
                                >
                                    Dashboard
                                </NavLink>
                                <NavLink
                                    href={route('seller.building.index')}
                                    active={route().current('seller.building.index')}
                                >
                                    Building
                                </NavLink>
                            </div>
                        </div>

                        {/* Right Section */}
                        <div className="hidden sm:flex sm:items-center space-x-4">
                            {/* Messages */}
                            <div className="relative">
                                {messagesCount > 0 && (
                                    <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold shadow-md">
                                        {messagesCount}
                                    </div>
                                )}
                                <Link
                                    href="/seller/messages"
                                    className="p-2 text-gray-300 hover:text-white"
                                >
                                    <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5" />
                                </Link>
                            </div>

                            {/* Notifications */}
                            <div className="relative">
                                {notificationsCount > 0 && (
                                    <div className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold shadow-md">
                                        {notificationsCount > 9 ? '+9' : notificationsCount}
                                    </div>
                                )}
                                <button
                                    onClick={() => setNotificationsModal(!notificationsModal)}
                                    className="p-2 text-gray-300 hover:text-white"
                                >
                                    <FontAwesomeIcon icon={faBell} className="h-5 w-5" />
                                </button>
                                {notificationsModal && <SellerNotifModal />}
                            </div>

                            {/* User Dropdown */}
                            <Dropdown>
                                <Dropdown.Trigger>
                                    <button
                                        type="button"
                                        className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium text-gray-300 hover:text-white"
                                    >
                                        <img
                                            src={`/storage/${user.avatar ? user.avatar : 'profile/default_avatar.png'}`}
                                            alt="avatar"
                                            className="h-7 w-7 rounded-full mr-2"
                                        />
                                        {user.name.split(' ')[0]}
                                    </button>
                                </Dropdown.Trigger>
                                <Dropdown.Content>
                                    <Dropdown.Link href={route('seller.profile.edit')}>
                                        Profile
                                    </Dropdown.Link>
                                    <Dropdown.Link href={route('seller.payment-details.index')}>
                                        Payment Details
                                    </Dropdown.Link>
                                    <Dropdown.Link
                                        href={route('seller.logout.post')}
                                        method="post"
                                        as="button"
                                    >
                                        Log Out
                                    </Dropdown.Link>
                                </Dropdown.Content>
                            </Dropdown>
                        </div>

                        {/* Mobile Hamburger */}
                        <div className="sm:hidden">
                            <button
                                onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                className="p-2 rounded-md text-gray-300 hover:text-white focus:outline-none"
                            >
                                {showingNavigationDropdown ? (
                                    <FontAwesomeIcon icon={faTimes} className="h-6 w-6" />
                                ) : (
                                    <FontAwesomeIcon icon={faBars} className="h-6 w-6" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu */}
                {showingNavigationDropdown && (
                    <div className="sm:hidden bg-gray-800 border-t border-gray-700">
                        <div className="space-y-1 px-4 py-3">
                            <ResponsiveNavLink href={route('seller.dashboard.index')}>
                                Dashboard
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route('seller.building.index')}>
                                Building
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route('seller.guest.index')}>
                                Guests
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route('seller.request.bed.index')}>
                                Requests
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route('seller.history.index')}>
                                History
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route('seller.request.payments.index')}>
                                Payments
                            </ResponsiveNavLink>

                            <ResponsiveNavLink href="/seller/messages">
                                Messages {messagesCount > 0 && `(${messagesCount})`}
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                as="button"
                                onClick={() => setNotificationsModal(true)}
                            >
                                Notifications {notificationsCount > 0 && `(${notificationsCount})`}
                            </ResponsiveNavLink>

                            <div className="border-t border-gray-700 my-2"></div>

                            <ResponsiveNavLink href={route('seller.profile.edit')}>
                                Profile
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route('seller.payment-details.index')}>
                                Payment Details
                            </ResponsiveNavLink>
                            <ResponsiveNavLink
                                method="post"
                                as="button"
                                href={route('seller.logout.post')}
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                )}
            </nav>

            {/* Header */}
            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main className="min-h-screen">{children}</main>
            <Footer />
        </div>
    );
}
