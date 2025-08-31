import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ChatWidget from '@/Pages/Message/ChatWidget';
import NavNotif from '@/Pages/Home/Notification/NavNotif';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import Footer from '@/Components/Footer';
import { FavoriteContext } from '@/Contexts/FavoriteContext';

import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect, createContext } from 'react';
import { faHeart, faBell, faEnvelope, faMapLocation, faBed } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from 'axios';
import OnboardingModal from '@/Pages/Home/Preferences/OnBoardingModal';
import BookingNotif from '@/Components/Notifications/User/BookingNotif';
export const ChatContext = createContext();

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);


    const [favoritesCount, setFavoritesCount] = useState(user?.favorites?.length || 0);
    const [messagesCount, setMessagesCount] = useState(0);

    const [notificationsModal, setNotificationsModal] = useState(false);
    const [notifVisiblt, setNotifVisible] = useState(null);
    const [notificationsCount, setNotificationsCount] = useState(0);
    useEffect(() => {
        if (user) {
            const channel = Echo.private(`favorites.${user.id}`)
                .listen('FavoriteToggled', (notif) => {
                    console.log("FavoriteToggled event received:", notif);
                    setFavoritesCount(notif.favorites_count);
                })
                .error((error) => {
                    console.error("Error while listening to favorites channel:", error);
                });


            // console.log(isOnline);
            return () => {
                if (window.Echo) {
                    // channel.leave();
                }
            };
        }
    }, [user?.id]);



    // Listen for new notifications
    useEffect(() => {
        window.Echo.private(`App.Models.User.${user.id}`)
            .notification((notification) => {
                console.log('🔔 New notification received!', notification);
                setNotifVisible(notification);
                setNotificationsCount(notificationsCount + 1);
            });
 
        axios.get("/notifications/count").then((res) => {
            setNotificationsCount(res.data.count);
        });

    }, [user?.id]); // 👈 add dependency array so it only runs once on mount


    const updateFavoritesCount = (newCount) => {
        setFavoritesCount(newCount);
    };
    return (
        <FavoriteContext.Provider value={{ favoritesCount, updateFavoritesCount }}>
            <BookingNotif notification={notifVisiblt} onClose={() => setNotifVisible(null)} />

            {/* (Optional) keep history */}
            <div className="min-h-screen ">
                {/* Background Image */}
                <div
                    className="fixed top-0 left-0 w-screen h-screen bg-cover bg-center bg-no-repeat -z-10"
                    style={{ backgroundImage: "url('/storage/system/background/background.webp')" }}
                ></div>
                {/* Navigation links */}
                <nav className="border-b border-gray-100 bg-gray-800 z-50 shadow-lg">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between">
                            <div className="flex">
                                <div className="flex shrink-0 items-center">
                                    <Link href="/">
                                        <ApplicationLogo className="block h-9 w-auto fill-current text-white" />
                                    </Link>
                                </div>

                                <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                    <NavLink
                                        href={route('to.user.buildings')}
                                        active={route().current('to.user.buildings')}
                                    >
                                        Home
                                    </NavLink>
                                </div>
                            </div>
                            <div className="hidden sm:flex sm:items-center gap-x-4">
                                {/* Accommodation & Map Links */}
                                <div className="flex space-x-3">
                                    <div className="relative group">
                                        <Link href={route('accommodations.index')} className="p-2 text-gray-600 hover:text-blue-500 transition duration-200 hover:scale-105">
                                            <FontAwesomeIcon icon={faBed} className="h-5 w-5 text-white hover:text-gray-500 transition duration-100 ease-in-out" />
                                        </Link>
                                        <span className="absolute left-1/2 top-8 translate-y-2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform duration-200 bg-gray-800 text-white text-xs rounded py-1 px-2 shadow-md">
                                            Accommodations
                                        </span>
                                    </div>

                                    <div className="relative group">
                                        <Link href={route('map.index')} className="p-2 text-gray-600 hover:text-green-500 transition duration-200 hover:scale-105">
                                            <FontAwesomeIcon icon={faMapLocation} className="h-5 w-5 text-white hover:text-gray-500 transition duration-100 ease-in-out" />
                                        </Link>
                                        <span className="absolute left-1/2 top-8 translate-y-2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform duration-200 bg-gray-800 text-white text-xs rounded py-1 px-2 shadow-md">
                                            Map
                                        </span>
                                    </div>
                                </div>

                                {/* Message Icon with Badge */}
                                <div className="relative group">
                                    {messagesCount > 0 && (
                                        <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold shadow-md">
                                            {messagesCount}
                                        </div>
                                    )}
                                    <Link href="/messages" className="inline-flex items-center justify-center p-2 text-gray-600 hover:scale-105 transition duration-200">
                                        <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 text-white hover:text-gray-500 transition duration-100 ease-in-out" />
                                    </Link>
                                    <span className="absolute left-1/2 top-8 translate-y-2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform duration-200 bg-gray-800 text-white text-xs rounded py-1 px-2 shadow-md">
                                        Messages
                                    </span>
                                </div>

                                {/* Favorites Icon with Badge */}
                                <div className="relative group">
                                    {favoritesCount > 0 && (
                                        <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold shadow-md">
                                            {favoritesCount}
                                        </div>
                                    )}
                                    <Link href="/favorites" className="inline-flex items-center justify-center p-2 text-gray-600 hover:scale-105 transition duration-200">
                                        <FontAwesomeIcon icon={faHeart} className="h-5 w-5 text-white hover:text-gray-500 transition duration-100 ease-in-out" />
                                    </Link>
                                    <span className="absolute left-1/2 top-8 translate-y-2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform duration-200 bg-gray-800 text-white text-xs rounded py-1 px-2 shadow-md">
                                        Favorites
                                    </span>
                                </div>
                                {/* Favorites Icon with Badge */}
                                <div className="relative group">
                                      {notificationsCount > 0 && (
                                        <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold shadow-md">
                                          {notificationsCount > 9 ? "+9" : notificationsCount}
                                        </div>
                                    )}
                                    <button
                                        onClick={() => setNotificationsModal(!notificationsModal)}
                                        className="inline-flex items-center justify-center p-2 text-gray-600 hover:scale-105 transition duration-200">
                                        <FontAwesomeIcon icon={faBell} className="h-5 w-5 text-white hover:text-gray-500 transition duration-100 ease-in-out" />
                                    </button>
                                    <span className="absolute left-1/2 top-8 translate-y-2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform duration-200 bg-gray-800 text-white text-xs rounded py-1 px-2 shadow-md">
                                        Notifications
                                    </span>
                                    {notificationsModal && <NavNotif />}
                                </div>



                                {/* User Dropdown */}
                                <div className="relative">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <button
                                                type="button"
                                                className="inline-flex items-center  px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-md hover:scale-105 transition-transform duration-200"
                                            >
                                                <img src={`/storage/${user?.avatar || 'profile/default_avatar.png'}`} alt={user?.avatar} className="h-8 w-8 rounded-full mr-2 border border-gray-300" />
                                                <span className="truncate text-white">{user?.name.split(' ')[0]}</span>

                                                <svg
                                                    className="ml-1 h-4 w-4 text-gray-400"
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
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                            <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
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
                                href={route('home')}
                                active={route().current('home')}
                            >
                                Home
                            </ResponsiveNavLink>
                        </div>
                        {/* Accommodation & Map Links */}
                        <div className="flex space-x-3">
                            <div className="relative group">
                                <Link href={route('accommodations.index')} className="p-2 text-gray-600 hover:text-blue-500 transition duration-200 hover:scale-105">
                                    <FontAwesomeIcon icon={faBed} className="h-5 w-5 text-white hover:text-gray-500 transition duration-100 ease-in-out" />
                                </Link>
                                <span className="absolute left-1/2 top-8 translate-y-2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform duration-200 bg-gray-800 text-white text-xs rounded py-1 px-2 shadow-md">
                                    Accommodations
                                </span>
                            </div>

                            <div className="relative group">
                                <Link href={route('map.index')} className="p-2 text-gray-600 hover:text-green-500 transition duration-200 hover:scale-105">
                                    <FontAwesomeIcon icon={faMapLocation} className="h-5 w-5 text-white hover:text-gray-500 transition duration-100 ease-in-out" />
                                </Link>
                                <span className="absolute left-1/2 top-8 translate-y-2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform duration-200 bg-gray-800 text-white text-xs rounded py-1 px-2 shadow-md">
                                    Map
                                </span>
                            </div>
                        </div>

                        {/* Message Icon with Badge */}
                        <div className="relative group">
                            {messagesCount > 0 && (
                                <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold shadow-md">
                                    {messagesCount}
                                </div>
                            )}
                            <Link href="/messages" className="inline-flex items-center justify-center p-2 text-gray-600 hover:scale-105 transition duration-200">
                                <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 text-white hover:text-gray-500 transition duration-100 ease-in-out" />
                            </Link>
                            <span className="absolute left-1/2 top-8 translate-y-2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform duration-200 bg-gray-800 text-white text-xs rounded py-1 px-2 shadow-md">
                                Messages
                            </span>
                        </div>

                        {/* Favorites Icon with Badge */}
                        <div className="relative group">
                            {favoritesCount > 0 && (
                                <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold shadow-md">
                                    {favoritesCount}
                                </div>
                            )}
                            <Link href="/favorites" className="inline-flex items-center justify-center p-2 text-gray-600 hover:scale-105 transition duration-200">
                                <FontAwesomeIcon icon={faHeart} className="h-5 w-5 text-white hover:text-gray-500 transition duration-100 ease-in-out" />
                            </Link>
                            <span className="absolute left-1/2 top-8 translate-y-2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform duration-200 bg-gray-800 text-white text-xs rounded py-1 px-2 shadow-md">
                                Favorites
                            </span>
                        </div>
                        {/* Favorites Icon with Badge */}
                        <div className="relative group">
                            {notificationsCount > 0 && (
                                <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold shadow-md">
                                    {notificationsCount > 9 ? "+9" : notificationsCount}
                                </div>
                            )}
                            <Link href="/favorites" className="inline-flex items-center justify-center p-2 text-gray-600 hover:scale-105 transition duration-200">
                                <FontAwesomeIcon icon={faBell} className="h-5 w-5 text-white hover:text-gray-500 transition duration-100 ease-in-out" />
                            </Link>
                            <span className="absolute left-1/2 top-8 translate-y-2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform duration-200 bg-gray-800 text-white text-xs rounded py-1 px-2 shadow-md">
                                Notificatoins
                            </span>
                        </div>


                        <div className="pb-1 pt-4">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                <div className='flex items-center pl-4'>
                                    <img src={`/storage/${user?.avatar || 'profile/default_avatar.png'}`} alt={user?.avatar} className="h-10 w-10 rounded-full" />
                                    <div className="px-4">
                                        <div className="text-base font-medium text-gray-800">
                                            {user?.name}
                                        </div>
                                        <div className="text-sm font-medium text-gray-500">
                                            {user?.email}
                                        </div>
                                    </div>
                                </div>
                            </ResponsiveNavLink>
                            <div className="mt-3 space-y-1">


                                <ResponsiveNavLink
                                    method="post"
                                    href={route('logout')}
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
                {user && !user.has_completed_onboarding && <OnboardingModal />}
                <main
                    className='min-h-screen'
                >{children}</main>

                <Footer />

            </div>

        </FavoriteContext.Provider>

    );
}
