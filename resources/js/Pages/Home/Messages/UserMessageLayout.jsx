import { Link, usePage, useForm } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUsers, faRobot, faStore } from "@fortawesome/free-solid-svg-icons";
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function UseMessageLayout({ children }) {
    const { url } = usePage();
    const [activeTab, setActiveTab] = useState('');
    const [previousUrl, setPreviousUrl] = useState('/home/buildings'); // fallback

    // Track active tab
    useEffect(() => {
        if (url.includes('/messages/owner')) {
            setActiveTab('landowner');
        } else if (url.includes('/messages')) {
            setActiveTab('direct');
        } else if (url.includes('/group')) {
            setActiveTab('group');
        }
    }, [url]);

    // Save last non-messages URL
    useEffect(() => {
        if (!url.startsWith('/messages') && !url.startsWith('/group')) {
            sessionStorage.setItem('previousUrl', url);
        }
        const stored = sessionStorage.getItem('previousUrl');
        if (stored) setPreviousUrl(stored);
    }, [url])

    const navItems = [
        { name: 'Direct', href: '/messages', icon: faUser, key: 'direct' },
        { name: 'Land Owner', href: '/messages/owner', icon: faStore, key: 'landowner' },
        { name: 'Group', href: '/group/', icon: faUsers, key: 'group' },
    ];

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-gray-100 via-blue-200 to-gray-300 overflow-hidden ">
            <div className="flex bg-gray-900 items-center justify-around shadow-lg mb-5 p-2 ">
                <Link href={previousUrl}>
                    <ApplicationLogo className="h-10 w-auto" relative={true} />
                </Link>


                {navItems.map((item) => (
                    <div key={item.key}>
                        <Link
                            href={item.href}
                            className={`flex  items-center space-x-3 p-2 text-sm rounded-md transition-all ${activeTab === item.key
                                ? 'bg-indigo-100 text-indigo-600 font-semibold'
                                : 'text-slate-100 hover:bg-gray-100 hover:text-slate-900'
                                }`}
                        >
                            <FontAwesomeIcon icon={item.icon} />
                            <span>{item.name}</span>
                        </Link>
                    </div>
                ))}
            </div>

            {/* Chat Window */}
            <div className='flex-1 overflow-hidden'>
                {children}
            </div>
        </div>
    );
}
