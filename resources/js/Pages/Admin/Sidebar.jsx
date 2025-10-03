import { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import NavLink from '@/Components/NavLink';
import SidebarLink from '@/Components/SidebarLink';
import ApplicationLogo from '@/Components/ApplicationLogo';
import { Home, Users, Building, User, LogOutIcon, CreditCard } from "lucide-react"; // example icons

export default function Sidebar({ className, isOpen, onToggle }) {
    const [ownerDropdownOpen, setOwnerDropdownOpen] = useState(false);
    const [buildingDropdownOpen, setBuildingDropdownOpen] = useState(false);

    const { post } = useForm();

    return (
        <aside
            onClick={onToggle}
            className={`fixed top-0 left-0 h-screen bg-blue-900 bg-opacity-80 backdrop-blur-md shadow-md transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'} ${className}`}>
            <div className="h-full flex flex-col">
                {/* Header */}
                <div className="relative h-16 flex items-center justify-center">
                    <ApplicationLogo
                        relative={true}
                        className={`cursor-pointer transition-all duration-300 ${isOpen ? 'h-20 w-20' : 'h-8 w-8'}`}
                    />
                </div>

                {/* Nav Links */}
                <nav className="flex-1 px-2 py-6 space-y-2">
                    <div className="flex flex-col space-y-2">
                        <NavLink
                            href={route('admin.dashboard')}
                            active={route().current('admin.dashboard')}
                            className={`flex items-center text-white ${isOpen ? "gap-3 justify-start" : "justify-center"}`}

                        >
                            <Home size={20} />
                            {isOpen && <span>Dashboard</span>}
                        </NavLink>

                        <NavLink
                            href={route('admin.users.index')}
                            active={route().current('admin.users.index')}
                            className={`flex items-center text-white ${isOpen ? "gap-3 justify-start" : "justify-center"}`}
                        >
                            <Users size={20} />
                            {isOpen && <span>Users</span>}
                        </NavLink>

                        {/* Owners Dropdown */}
                        <button
                            onClick={(e) => {
                                setOwnerDropdownOpen(!ownerDropdownOpen);
                                e.stopPropagation();
                            }}
                            className={`flex items-center text-white ${isOpen ? "gap-3 justify-start" : "justify-center"}`}
                        >
                            <User size={20} />
                            {isOpen && <span>Owners</span>}
                        </button>

                        {isOpen && ownerDropdownOpen && (
                            <div className="ml-8 mt-2 space-y-1 flex flex-col">
                                <SidebarLink href={route('admin.owners')} active={route().current('admin.owners')}>
                                    Owners
                                </SidebarLink>
                                <SidebarLink href={route('admin.applications.index')} active={route().current('admin.applications.index')}>
                                    Applications
                                </SidebarLink>
                                <SidebarLink href={route('admin.subscriptions.index')} active={route().current('admin.subscriptions.index')}>
                                    Subscriptions
                                </SidebarLink>
                            </div>
                        )}

                        {/* Buildings Dropdown */}
                        <button
                            onClick={(e) => {
                                setBuildingDropdownOpen(!buildingDropdownOpen);
                                e.stopPropagation();
                            }}
                            className={`flex items-center text-white ${isOpen ? "gap-3 justify-start" : "justify-center"}`}
                        >
                            <Building size={20} />
                            {isOpen && <span>Buildings</span>}
                        </button>

                        {isOpen && buildingDropdownOpen && (
                            <div className="ml-8 mt-2 space-y-1 flex flex-col">
                                <SidebarLink href={route('admin.owner.buildings.index')} active={route().current('admin.owner.buildings.index')}>
                                    Buildings
                                </SidebarLink>
                                <SidebarLink href={route('admin.owner.buildings.map.destination.index')} active={route().current('admin.owner.buildings.map.destination.index')}>
                                    Destinations
                                </SidebarLink>
                                <SidebarLink href={route('admin.owner.building.application.index')} active={route().current('admin.owner.building.application.index')}>
                                    Applications
                                </SidebarLink>
                            </div>
                        )}

                        <NavLink
                            href={route('admin.profile')}
                            active={route().current('admin.profile')}
                            className={`flex items-center text-white ${isOpen ? "gap-3 justify-start" : "justify-center"}`}
                        >
                            <User size={20} />
                            {isOpen && <span>Profile</span>}
                        </NavLink>

                        <NavLink
                            href={route('admin.payment.info.index')}
                            active={route().current('admin.payment.info.index')}
                            className={`flex items-center text-white ${isOpen ? "gap-3 justify-start" : "justify-center"}`}
                        >
                            <CreditCard size={20} />
                            {isOpen && <span>Payment Info</span>}
                        </NavLink>
                    </div>
                </nav>

                {/* Logout Button */}
                <div className="p-4">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            post(route('admin.logout.post'));
                        }}
                        className={`flex items-center text-gray-800 hover:text-gray-900 transition-all duration-300 rounded-full 
                      ${isOpen ? "gap-2 px-4 py-2 w-full justify-center bg-slate-100 hover:bg-slate-300"
                                : "p-2 mx-auto justify-center bg-slate-100 hover:bg-slate-300"}`}
                    >
                        <LogOutIcon size={20} />
                        {isOpen && <span>Logout</span>}
                    </button>
                </div>

            </div>
        </aside>
    );
}
