import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import UserNotifModal from '@/Components/UserNotifModal';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import Footer from '@/Components/Footer';
import { FavoriteContext } from '@/Contexts/FavoriteContext';

import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect, createContext } from 'react';
import { faHeart, faHome, faUser, faStore, faRightFromBracket, faBell, faEnvelope, faMapLocation, faBed } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from 'axios';
import OnboardingModal from '@/Pages/Home/Preferences/OnBoardingModal';
import Notif from '@/Components/Notifications/User/Notif';
import PopupNotif from '@/Components/Notifications/Owner/PopupNotif';

export const ChatContext = createContext();

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const [favoritesCount, setFavoritesCount] = useState(user?.favorites?.length || 0);
    const [messagesCount, setMessagesCount] = useState(0);

    const [notificationsModal, setNotificationsModal] = useState(false);
    const [notifVisible, setNotifVisible] = useState(null);
    const [notificationsCount, setNotificationsCount] = useState(0);

    useEffect(() => {
        if (user) {
            const channel = Echo.private(`favorites.${user.id}`)
                .listen('FavoriteToggled', (notif) => {
                    setFavoritesCount(notif.favorites_count);
                })
                .error((error) => {
                    console.error("Error while listening to favorites channel:", error);
                });

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
                setNotifVisible(notification);
                setNotificationsCount(notificationsCount + 1);
            });

        axios.get("/notifications/count").then((res) => {
            setNotificationsCount(res.data.count);
        });

    }, [user?.id]);

    useEffect(() => {
        const channel = window.Echo.join('online-users');

        return () => {
            window.Echo.leave('online-users');
        };
    }, []);

    const updateFavoritesCount = (change) => {
        setFavoritesCount((prev) => Math.max(0, prev + change)); // ✅ adjust not replace

    };

    return (
        <FavoriteContext.Provider value={{ favoritesCount, updateFavoritesCount }}>
            <PopupNotif notification={notifVisible} onClose={() => setNotifVisible(null)} />

            <div className="min-h-screen ">

                <div
                    className="fixed -z-10 offset-0 w-screen h-screen bg-gradient-to-br from-gray-100 via-blue-200 to-gray-300"
                >


                </div>
                {/* Navigation */}
                <nav className="border-b border-gray-100 bg-gray-800 z-50 shadow-lg">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16 justify-between">
                            <div className="flex items-center h-16 space-x-6">
                                <Link href="/">
                                    <ApplicationLogo className=' h-10 w-auto ' relative={true} />
                                </Link>

                                <div className="hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                                    <NavLink href={route('to.user.buildings')} active={route().current('to.user.buildings')}>
                                        Home
                                    </NavLink>
                                </div>
                            </div>



                            {/* Desktop Right Side */}
                            <div className="hidden sm:flex sm:items-center gap-x-4">
                                {/* Accommodation & Map */}
                                <div className="flex space-x-3">
                                    <div className="relative group">
                                        <Link href={route('accommodations.index')} className="p-2">
                                            <FontAwesomeIcon icon={faBed} className="h-5 w-5 text-white" />
                                        </Link>
                                        <span className="absolute left-1/2 top-8 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform duration-200 bg-gray-800 text-white text-xs rounded py-1 px-2">
                                            Accommodations
                                        </span>
                                    </div>

                                    <div className="relative group">
                                        <Link href={route('map.index')} className="p-2">
                                            <FontAwesomeIcon icon={faMapLocation} className="h-5 w-5 text-white" />
                                        </Link>
                                        <span className="absolute left-1/2 top-8 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform duration-200 bg-gray-800 text-white text-xs rounded py-1 px-2">
                                            Map
                                        </span>
                                    </div>
                                </div>

                                {/* Messages */}
                                <div className="relative group">
                                    {messagesCount > 0 && (
                                        <div className="absolute -top-1.5 -right-1.5 h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                                            {messagesCount > 9 ? "+9" : messagesCount}
                                        </div>
                                    )}
                                    <div className='relative group'>
                                        <Link href="/messages" className="p-2 flex items-center justify-center w-10 h-10">
                                            <FontAwesomeIcon icon={faEnvelope} className="h-5 w-5 text-white" />
                                        </Link>
                                        <span className="absolute left-1/2 top-8 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform duration-200 bg-gray-800 text-white text-xs rounded py-1 px-2">
                                            Messages
                                        </span>
                                    </div>
                                </div>

                                {/* Favorites */}
                                <div className="relative group">
                                    {favoritesCount > 0 && (
                                        <div className="absolute -top-1.5 -right-1.5 h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                                            {favoritesCount > 9 ? "+9" : favoritesCount}
                                        </div>
                                    )}
                                    <div className='relative group'>
                                        <Link href="/favorite" className="p-2 flex items-center justify-center w-10 h-10">
                                            <FontAwesomeIcon icon={faHeart} className="h-5 w-5 text-white" />
                                        </Link>
                                        <span className="absolute left-1/2 top-8 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform duration-200 bg-gray-800 text-white text-xs rounded py-1 px-2">
                                            Favorites
                                        </span>
                                    </div>
                                </div>

                                {/* Notifications */}
                                <div className="relative group">
                                    {notificationsCount > 0 && (
                                        <div className="absolute -top-1.5 -right-1.5 h-5 w-5 flex items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold">
                                            {notificationsCount > 9 ? "+9" : notificationsCount}
                                        </div>
                                    )}
                                    <div className='relative group'>
                                        <button
                                            onClick={() => setNotificationsModal(!notificationsModal)}
                                            className="p-2 flex items-center justify-center w-10 h-10">

                                            <FontAwesomeIcon icon={faBell} className="h-5 w-5 text-white" />
                                        </button>
                                        <span className="absolute left-1/2 top-8 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform duration-200 bg-gray-800 text-white text-xs rounded py-1 px-2">
                                            Notifications
                                        </span>


                                    </div>
                                    {notificationsModal && <UserNotifModal />}
                                </div>

                                {/* User Dropdown */}
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button className="inline-flex items-center px-3 py-2 text-sm text-white">
                                            <img
                                                src={`/storage/${user?.avatar || 'profile/default_avatar.png'}`}
                                                alt="avatar"
                                                className="h-8 w-8 rounded-full mr-2 border border-gray-300"
                                            />
                                            <span>{user?.name.split(' ')[0]}</span>
                                            <svg
                                                className="ml-1 h-4 w-4 text-gray-400"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
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
                                        <Dropdown.Link href={route('seller.register.index')}>Apply as owner</Dropdown.Link>
                                        <Dropdown.Link href={route('logout')} method="post" as="button">
                                            Log Out
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>

                            {/* Mobile Hamburger */}
                            <div className="flex items-center sm:hidden">
                                <button
                                    onClick={() => setShowingNavigationDropdown(!showingNavigationDropdown)}
                                    className="inline-flex items-center justify-center rounded-md p-2 text-gray-200 hover:bg-gray-700"
                                >
                                    <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                                        {showingNavigationDropdown ? (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                        ) : (
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                        )}
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Dropdown Menu */}
                    {showingNavigationDropdown && (
                        <div className="sm:hidden bg-gray-900 text-white px-4 pt-3 pb-6 space-y-3">
                            {/* Home */}
                            <ResponsiveNavLink
                                href={route("to.user.buildings")}
                                active={route().current("to.user.buildings")}
                                className="flex items-center gap-3 text-sm"
                            >
                                <FontAwesomeIcon icon={faHome} className="w-5 h-5 text-indigo-400" />
                                <span>Home</span>
                            </ResponsiveNavLink>

                            {/* Accommodations */}
                            <ResponsiveNavLink
                                href={route("accommodations.index")}
                                className="flex items-center gap-3 text-sm"
                            >
                                <FontAwesomeIcon icon={faBed} className="w-5 h-5 text-indigo-400" />
                                <span>Accommodations</span>
                            </ResponsiveNavLink>

                            {/* Map */}
                            <ResponsiveNavLink
                                href={route("map.index")}
                                className="flex items-center gap-3 text-sm"
                            >
                                <FontAwesomeIcon icon={faMapLocation} className="w-5 h-5 text-indigo-400" />
                                <span>Map</span>
                            </ResponsiveNavLink>

                            {/* Messages */}
                            <ResponsiveNavLink href="/messages" className="flex items-center gap-3 text-sm">
                                <div className="relative">
                                    <FontAwesomeIcon icon={faEnvelope} className="w-5 h-5 text-indigo-400" />
                                    {messagesCount > 0 && (
                                        <span className="absolute -top-1.5 -right-2 h-4 w-4 flex items-center justify-center text-[10px] bg-red-500 rounded-full font-bold">
                                            {messagesCount > 9 ? "+9" : messagesCount}
                                        </span>
                                    )}
                                </div>
                                <span>Messages</span>
                            </ResponsiveNavLink>

                            {/* Favorites */}
                            <ResponsiveNavLink href="/favorites" className="flex items-center gap-3 text-sm">
                                <div className="relative">
                                    <FontAwesomeIcon icon={faHeart} className="w-5 h-5 text-indigo-400" />
                                    {favoritesCount > 0 && (
                                        <span className="absolute -top-1.5 -right-2 h-4 w-4 flex items-center justify-center text-[10px] bg-red-500 rounded-full font-bold">
                                            {favoritesCount > 9 ? "+9" : favoritesCount}
                                        </span>
                                    )}
                                </div>
                                <span>Favorites</span>
                            </ResponsiveNavLink>
                            <ResponsiveNavLink href={route('notifications.index')} className="flex items-center gap-3 text-sm">
                                <div className="relative">
                                    <FontAwesomeIcon icon={faBell} className="w-5 h-5 text-indigo-400" />
                                    {notificationsCount > 0 && (
                                        <span className="absolute -top-1.5 -right-2 h-4 w-4 flex items-center justify-center text-[10px] bg-red-500 rounded-full font-bold">
                                            {notificationsCount > 9 ? "+9" : notificationsCount}
                                        </span>
                                    )}
                                </div>
                                <span>Notifications</span>
                            </ResponsiveNavLink>



                            {/* Divider */}
                            <div className="border-t border-gray-700 pt-3 mt-2"></div>

                            {/* User Section */}
                            <ResponsiveNavLink href={route("profile.edit")} className="flex items-center gap-3 text-sm">
                                <FontAwesomeIcon icon={faUser} className="w-5 h-5 text-indigo-400" />
                                <span>Profile</span>
                            </ResponsiveNavLink>

                            <ResponsiveNavLink href={route("seller.register.index")} className="flex items-center gap-3 text-sm">
                                <FontAwesomeIcon icon={faStore} className="w-5 h-5 text-indigo-400" />
                                <span>Apply as Owner</span>
                            </ResponsiveNavLink>

                            <ResponsiveNavLink method="post" href={route("logout")} as="button" className="flex items-center gap-3 text-sm">
                                <FontAwesomeIcon icon={faRightFromBracket} className="w-5 h-5 text-indigo-400" />
                                <span>Log Out</span>
                            </ResponsiveNavLink>
                        </div>
                    )}

                </nav>

                {header && (
                    <header className="bg-white shadow">
                        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">{header}</div>
                    </header>
                )}

                {user && !user.has_completed_onboarding && <OnboardingModal />}
                <main className="min-h-screen bg-blue">{children}</main>
                <Footer />
            </div>
        </FavoriteContext.Provider>
    );
}
