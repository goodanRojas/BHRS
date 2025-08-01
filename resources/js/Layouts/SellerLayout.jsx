import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import Footer from '@/Components/Footer';
import NotificationPopup from '@/Components/NotificationPopup';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
export default function SellerLayout({ header, children }) {
    const user = usePage().props.auth.seller;
    // console.log(user);
    const [notification, setNotification] = useState(null);
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);
    const [messagesCount, setMessagesCount] = useState(0);
    useEffect(() => {
        const landlordId = user?.id; // however you get it

        if (!landlordId) return;

        const channel = window.Echo.private(`landlord.${landlordId}`)
            .listen('.NewBookingCreated', (e) => {
                setNotification({
                    message: `${e.tenant_name} has booked your ${e.room_name}`,
                    tenantName: e.tenant_name,
                    tenantEmail: e.tenant_email,
                    tenantAvatar: e.tenant_avatar,
                    roomName: e.room_name,
                    roomImage: e.room_image,
                    startDate: e.start_date,
                    monthCount: e.month_count,
                    paymentMethod: e.payment_method,
                });


                // Hide notification after 5 seconds
                setTimeout(() => setNotification(null), 15000);
            });

        return () => {
            channel.stopListening('.NewBookingCreated');
        };
    }, [user?.id]);

    const handleCloseNotification = () => {
        setNotification(null);  // Close the notification when the button is clicked
    };
    return (
        <div className="min-h-screen ">
            {notification && (
                <NotificationPopup
                    message={notification.message}
                    tenantName={notification.tenantName}
                    tenantEmail={notification.tenantEmail}
                    tenantAvatar={notification.tenantAvatar}
                    roomName={notification.roomName}
                    roomImage={notification.roomImage}
                    startDate={notification.startDate}
                    monthCount={notification.monthCount}
                    paymentMethod={notification.paymentMethod}
                    onClose={handleCloseNotification}
                />
            )}


            {/* Background Image */}
            <div
                className="fixed top-0 left-0  h-screen bg-cover bg-center bg-no-repeat -z-10"
                style={{ backgroundImage: "url('/storage/system/background/background.webp')" }}
            ></div>
            {/* Navbar */}
            <nav className="border-b border-gray-100 bg-gray-800 shadow-lg">
                <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex h-16 justify-between">
                        <div className="flex">
                            <div className="flex shrink-0 items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800" />
                                </Link>
                            </div>

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


                                <div className="hidden sm:ms-6 sm:flex sm:items-center">
                                    <div className="relative ms-3">
                                        <Dropdown
                                            defaultOpen={
                                                route().current('seller.guest.index') ||
                                                route().current('seller.request.index') ||
                                                route().current('seller.history.index')
                                            }
                                        >

                                            <Dropdown.Trigger>
                                                <span
                                                    className="inline-flex items-center px-1 pt-1 text-sm font-medium leading-5 transition duration-150 ease-in-out hover:text-gray-700"
                                                >
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center rounded-md  px-3 py-2 text-sm font-medium leading-4 text-white transition duration-150 ease-in-out hover:text-gray-700 focus:"
                                                    >
                                                        Guests

                                                        <svg
                                                            className="-me-0.5 ms-2 h-4 w-4"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </button>
                                                </span>
                                            </Dropdown.Trigger>

                                            <Dropdown.Content>
                                                <Dropdown.Link
                                                    href={route('seller.guest.index')}
                                                    active={route().current('seller.guest.index')}
                                                >
                                                    Guests
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={route('seller.request.index')}
                                                    active={route().current('seller.request.index')}
                                                >
                                                    Requests
                                                </Dropdown.Link>
                                                <Dropdown.Link
                                                    href={route('seller.history.index')}
                                                    active={route().current('seller.history.index')}
                                                >
                                                    History
                                                </Dropdown.Link>
                                            </Dropdown.Content>
                                        </Dropdown>
                                    </div>
                                </div>

                                {/* Message Icon with Badge */}
                                <div className="relative group flex items-center justify-center">
                                    {messagesCount > 0 && (
                                        <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold shadow-md">
                                            {messagesCount}
                                        </div>
                                    )}
                                    <Link href="/seller/messages" className="inline-flex items-center justify-center p-2 text-gray-600 hover:scale-105 transition duration-200">
                                        <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 text-blue-400 hover:text-blue-500" />
                                    </Link>
                                    <span className="absolute left-1/2 top-10 translate-y-2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform duration-200 bg-gray-800 text-white text-xs rounded py-1 px-2 shadow-md">
                                        Messages
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center rounded-md px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out hover:text-gray-700 focus:"
                                            >
                                                <img src={`/storage/${user.avatar ? user.avatar : 'profile/default_avatar.png'}`} alt={user.avatar} className="h-7 w-7 rounded-full mr-2" />
                                                {user.name.split(' ')[0]}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <Dropdown.Link
                                            href={route('seller.profile.edit')}
                                        >
                                            Profile
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
                        </div>

                        <div className="-me-2 flex items-center sm:hidden">
                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState,
                                    )
                                }
                                className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 transition duration-150 ease-in-out hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="h-6 w-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? 'inline-flex'
                                                : 'hidden'
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? 'block' : 'hidden') +
                        ' sm:hidden'
                    }
                >
                    <div className="space-y-1 pb-3 pt-2">
                        <ResponsiveNavLink
                            href={route('seller.dashboard.index')}
                            active={route().current('seller.dashboard.index')}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                    </div>

                    <div className="pb-1 pt-4">
                        <ResponsiveNavLink href={route('profile.edit')}>
                            <div className='flex items-center pl-4'>
                                <img src={`/storage/${user.avatar ? user.avatar : 'profile/default_avatar.png'}`} alt={user.avatar} className="h-7 w-7 rounded-full mr-2" />
                                <div className="px-4">
                                    <div className="text-base font-medium text-gray-800">
                                        {user.name}
                                    </div>
                                    <div className="text-sm font-medium text-gray-500">
                                        {user.email}
                                    </div>
                                </div>
                            </div>
                        </ResponsiveNavLink>
                        <div className="mt-3 space-y-1">


                            <ResponsiveNavLink
                                method="post"
                                href={route('seller.logout.post')}
                                as="button"
                            >
                                Log Out
                            </ResponsiveNavLink>
                        </div>
                    </div>
                </div>
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>

            <Footer />
        </div>
    );
}
