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
import axios from 'axios';
import PopupNotif from '@/Components/Notifications/Owner/PopupNotif';

export default function SellerLayout({ header, children }) {
    const user = usePage().props.auth.seller;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [messagesCount, setMessagesCount] = useState(0);

    /* Notification States */
    const [notificationsModal, setNotificationsModal] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [notifVisiblt, setNotifVisible] = useState(null);
    const [notificationsCount, setNotificationsCount] = useState(0);
    const [subscriptionType, setSubscriptionType] = useState(null);
    useEffect(() => {
        axios.get('/seller/current/subscription').then((res) => {
            const sub = res.data.subscription;
            setSubscriptionType(sub ? sub.plan.plan : null);
        });
    }, [user?.id]);

    // Listen for new notifications
    useEffect(() => {
        window.Echo.private(`App.Models.Seller.${user.id}`)
            .notification((notification) => {

                setNotifications((prev) => [notification, ...prev]);
                setNotifVisible(notification);
                console.log('New notification:', notification);
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
            <PopupNotif notification={notifVisiblt} onClose={() => setNotifVisible(null)} />

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
                            <Link href="/">
                                <ApplicationLogo className=' h-10 w-auto ' relative={true} />
                            </Link>

                            {/* Desktop Nav Links */}
                            <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                <NavLink
                                    href={route('seller.dashboard.index')}
                                    active={route().current('seller.dashboard.index')}
                                >
                                    Dashboard
                                </NavLink>

                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="inline-flex items-center px-3 py-2 text-sm text-white">
                                            Building
                                            <svg className="ml-1 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('seller.building.index')}>Building</Dropdown.Link>
                                        <Dropdown.Link href="/seller/app">Application</Dropdown.Link>
                                        <Dropdown.Link href="/seller/building/requests">Requests</Dropdown.Link>

                                    </Dropdown.Content>
                                </Dropdown>
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="inline-flex items-center px-3 py-2 text-sm text-white">
                                            Guests
                                            <svg className="ml-1 h-4 w-4 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </Dropdown.Trigger>
                                    <Dropdown.Content>
                                        <Dropdown.Link href={route('seller.guest.index')}>Guests</Dropdown.Link>
                                        <Dropdown.Link href={route('seller.request.bed.index')}>Requests</Dropdown.Link>
                                        <Dropdown.Link href={route('seller.request.payments.index')}>Payments</Dropdown.Link>

                                    </Dropdown.Content>
                                </Dropdown>
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
                                        <div className="relative h-9 w-9 mr-2">
                                            {/* Avatar with colored border */}
                                            <div
                                                className={`h-9 w-9 rounded-full border-2 p-0.5
                        ${subscriptionType === "Bronze" ? "border-yellow-700" :
                                                        subscriptionType === "Silver" ? "border-gray-400" :
                                                            subscriptionType === "Gold" ? "border-yellow-500" :
                                                                "border-transparent"}`}
                                            >
                                                <img
                                                    src={`/storage/${user.avatar ? user.avatar : 'profile/default_avatar.png'}`}
                                                    alt="avatar"
                                                    className="h-full w-full rounded-full object-cover"
                                                />
                                            </div>

                                            {/* Plan label */}
                                            {subscriptionType && (
                                                <span
                                                    className={`absolute -bottom-1 left-1 -translate-x-1/2 px-0.5 text-[7px] font-semibold rounded-full
                                                                   ${subscriptionType === "Bronze" ? "bg-yellow-700 text-white" :
                                                            subscriptionType === "Silver" ? "bg-gray-400 text-black" :
                                                                subscriptionType === "Gold" ? "bg-yellow-500 text-black" :
                                                                    "bg-gray-600 text-white"}`}
                                                >
                                                    {subscriptionType}
                                                </span>
                                            )}
                                        </div>

                                        {/* First name */}
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
                                    <Dropdown.Link href={route('seller.subscription.landing')}>
                                        Subscription
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
                            <ResponsiveNavLink href={route('seller.subscription.landing')}>
                                Subscription
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
