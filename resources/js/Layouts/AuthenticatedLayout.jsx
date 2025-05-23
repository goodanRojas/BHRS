import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import ChatWidget from '@/Pages/Message/ChatWidget';
import ResponsiveNavLink from '@/Components/ResponsiveNavLink';
import Footer from '@/Components/Footer';
import { FavoriteContext } from '@/Contexts/FavoriteContext';

import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect, createContext } from 'react';
import { faHeart, faBell, faMapLocation, faBed } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from 'axios';

export const ChatContext = createContext();

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const [notificationsModal, setNotificationsModal] = useState(false);
    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);


    const [directMessages, setDirectMessages] = useState({});
    const [groupMessages, setGroupMessages] = useState({});
    const [botMessages, setBotMessages] = useState({});
    const [favoritesCount, setFavoritesCount] = useState(user.favorites.length);
    useEffect(() => {
      
        if (user) {
         
            axios.get("/direct-message")
                .then(({ data }) => setDirectMessages(data.direct))
                .catch((err) => console.error("Error loading direct messages:", err));
   

            Echo.private(`direct-messages.${user.id}`)
                .listen('MessageSent', (message) => {
                    setDirectMessages((prevMessages) => ({
                        ...prevMessages,
                        [message.sender_id]: [
                            ...(prevMessages[message.sender_id] || []),
                            message,
                        ],
                    }));
                });

      
        }
        return () => {
            if (window.Echo) {
                window.Echo.leave(`direct-messages.${user.id}`);
             }
        }
    }, []);

    useEffect(() => {
        if (user) {
            console.log("Subscribing to favorites channel");
    
            const channel = Echo.private(`favorites.${user.id}`)
                .listen('FavoriteToggled', (notif) => {
                    console.log("FavoriteToggled event received:", notif);
                    setFavoritesCount(notif.favorites_count);
                })
                .error((error) => {
                    console.error("Error while listening to favorites channel:", error);
                });
    
            // Log the Echo object and channel subscription status
       /*      console.log(Echo);
            console.log(channel); */
    
            return () => {
                if (window.Echo) {
                    console.log("Leaving favorites channel");
                    // channel.leave();
                }
            };
        }
    }, [user?.id]);
    

    const updateFavoritesCount = (newCount) => {
        setFavoritesCount(newCount);
    };
    return (
        <FavoriteContext.Provider value={{ favoritesCount, updateFavoritesCount }}>

            <div className="min-h-screen ">
               {/* Background Image */}
            <div
                className="fixed top-0 left-0 w-screen h-screen bg-cover bg-center bg-no-repeat -z-10"
                style={{ backgroundImage: "url('/storage/system/background/background.webp')" }}
            ></div>
                <nav className="border-b border-gray-100 bg-white z-50 shadow-lg">
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
                                        href={route('home')}
                                        active={route().current('home')}
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
                                            <FontAwesomeIcon icon={faBed} className="h-5 w-5" />
                                        </Link>
                                        <span className="absolute left-1/2 top-8 translate-y-2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform duration-200 bg-gray-800 text-white text-xs rounded py-1 px-2 shadow-md">
                                            Accommodations
                                        </span>
                                    </div>

                                    <div className="relative group">
                                        <Link href={route('map.index')} className="p-2 text-gray-600 hover:text-green-500 transition duration-200 hover:scale-105">
                                            <FontAwesomeIcon icon={faMapLocation} className="h-5 w-5" />
                                        </Link>
                                        <span className="absolute left-1/2 top-8 translate-y-2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform duration-200 bg-gray-800 text-white text-xs rounded py-1 px-2 shadow-md">
                                            Map
                                        </span>
                                    </div>
                                </div>

                                {/* Favorites Icon with Badge */}
                                <div className="relative group">
                                    {favoritesCount > 0 && (
                                        <div className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white text-xs font-bold shadow-md">
                                            {favoritesCount}
                                        </div>
                                    )}
                                    <Link href="/favorites" className="inline-flex items-center justify-center p-2 text-gray-600 hover:scale-105 transition duration-200">
                                        <FontAwesomeIcon icon={faHeart} className="h-5 w-5 text-red-400 hover:text-red-500" />
                                    </Link>
                                    <span className="absolute left-1/2 top-8 translate-y-2 -translate-x-1/2 scale-0 group-hover:scale-100 transition-transform duration-200 bg-gray-800 text-white text-xs rounded py-1 px-2 shadow-md">
                                        Favorites
                                    </span>
                                </div>

                                {/* Notifications Dropdown */}
                                <div className="relative group">
                                    {user.notifications.length > 0 && (
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
                                            {user.notifications.length > 0 ? (
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

                                {/* User Dropdown */}
                                <div className="relative">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <button
                                                type="button"
                                                className="inline-flex items-center  px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-400 hover:scale-105 transition-transform duration-200"
                                            >
                                                <img src={`/storage/user/${user.avatar || 'default_avatar.png'}`} alt={user.avatar} className="h-8 w-8 rounded-full mr-2 border border-gray-300" />
                                                <span className="truncate">{user.name.split(' ')[0]}</span>

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

                        <div className="pb-1 pt-4">
                            <ResponsiveNavLink href={route('profile.edit')}>
                                <div className='flex items-center pl-4'>
                                    <img src={`/storage/profile/${user.avatar || 'default_avatar.png'}`} alt={user.avatar} className="h-10 w-10 rounded-full" />
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
                <main
                    className='min-h-screen'
                >{children}</main>
                <ChatContext.Provider value={{
                    directMessages,
                    setDirectMessages,
                    groupMessages,
                    setGroupMessages,
                    botMessages,
                    setBotMessages,
                }}>

                    <ChatWidget />
                </ChatContext.Provider>
                <Footer />

            </div>

        </FavoriteContext.Provider>

    );
}
