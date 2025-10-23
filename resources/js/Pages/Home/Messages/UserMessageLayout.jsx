import { Link, usePage, useForm } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import * as LucideIcons from "lucide-react";
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function UseMessageLayout({ children }) {
    const { url } = usePage();
    const [activeTab, setActiveTab] = useState('');
    const [previousUrl, setPreviousUrl] = useState('/home/buildings'); // fallback
    const [menuOpen, setMenuOpen] = useState(false);

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
        { name: 'Direct', href: '/messages', icon: 'User', key: 'direct' },
        { name: 'Land Owner', href: '/messages/owner', icon: 'Store', key: 'landowner' },
        { name: 'Group', href: '/group/', icon: 'Users', key: 'group' },
    ];

    return (
        <div className="flex flex-col min-h-screen bg-gradient-to-br from-slate-100 via-blue-100 to-indigo-200 overflow-hidden">
            {/* Navbar */}
            <motion.nav
                initial={{ y: -40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.4 }}
                className="flex items-center justify-between bg-gray-900 px-4 py-3 shadow-lg"
            >
                {/* Left: Logo */}
                <Link href={previousUrl}>
                    <ApplicationLogo className="h-10 w-auto" relative={true} />
                </Link>

                {/* Right: Menu (Desktop) */}
                <div className="hidden md:flex space-x-2">
                    {navItems.map((item) => {
                        const Icon = LucideIcons[item.icon] || LucideIcons.Circle;
                        return (
                            <Link
                                key={item.key}
                                href={item.href}
                                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === item.key
                                    ? "bg-indigo-100 text-indigo-700 shadow-inner"
                                    : "text-slate-200 hover:bg-slate-100 hover:text-slate-900"
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                <span>{item.name}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Mobile Menu Button */}
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="md:hidden text-slate-100 hover:text-indigo-300 transition-colors"
                >
                    {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </motion.nav>

            {/* Mobile Menu Dropdown */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="md:hidden bg-gray-800 shadow-lg z-20"
                    >
                        <div className="flex flex-col space-y-1 p-3">
                            {navItems.map((item) => {
                                const Icon = LucideIcons[item.icon] || LucideIcons.Circle;
                                return (
                                    <Link
                                        key={item.key}
                                        href={item.href}
                                        onClick={() => setMenuOpen(false)}
                                        className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${activeTab === item.key
                                            ? "bg-indigo-100 text-indigo-700 shadow-inner"
                                            : "text-slate-100 hover:bg-slate-100 hover:text-slate-900"
                                            }`}
                                    >
                                        <Icon className="w-4 h-4" />
                                        <span>{item.name}</span>
                                    </Link>
                                );
                            })}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <motion.main
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="flex-1 overflow-x-hidden"
            >
                {children}
            </motion.main>
        </div>
    );
}
