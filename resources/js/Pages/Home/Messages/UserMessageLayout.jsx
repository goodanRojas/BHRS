import { Link, usePage } from '@inertiajs/react';
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { useEffect, useState } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faUsers, faRobot, faStore } from "@fortawesome/free-solid-svg-icons";

export default function UseMessageLayout({ children }) {
    const { url } = usePage();
    const [activeTab, setActiveTab] = useState('');

    useEffect(() => {
        if (url.includes('/messages/owner')) {
            setActiveTab('landowner');
        } else if (url.includes('/messages')) {
            setActiveTab('direct');
        } else if (url.includes('/group-chat')) {
            setActiveTab('group');
        }
    }, [url]);

    const navItems = [
        { name: 'Direct', href: '/messages', icon: faUser, key: 'direct' },
        { name: 'Land Owner', href: '/messages/owner', icon: faStore, key: 'landowner' },
        { name: 'Group', href: '/group/', icon: faUsers, key: 'group' },
    ];

    return (
        <AuthenticatedLayout>
            <div className="flex flex-col h-[calc(100vh-4rem)] ">
                {/* Sidebar */}
                <div className="flex items-center justify-around shadow-md p-2 ">
                  
                        {navItems.map((item) => (
                            <div key={item.key}>
                                <Link
                                    href={item.href}
                                    className={`flex  items-center space-x-3 p-2 text-sm rounded-md transition-all ${activeTab === item.key
                                            ? 'bg-indigo-100 text-indigo-600 font-semibold'
                                            : 'text-gray-700 hover:bg-gray-100'
                                        }`}
                                >
                                    <FontAwesomeIcon icon={item.icon} />
                                    <span>{item.name}</span>
                                </Link>
                            </div>
                        ))}
                </div>

                {/* Chat Window */}
                <div className='min-h-screen'>
                    {children}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
