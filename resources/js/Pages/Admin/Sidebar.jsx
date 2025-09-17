import { useEffect, useState } from 'react';
import { useForm } from '@inertiajs/react';
import NavLink from '@/Components/NavLink';
import SidebarLink from '@/Components/SidebarLink';
import ApplicationLogo from '@/Components/ApplicationLogo';

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
                <div className="relative h-16  flex items-center justify-center">
                    <ApplicationLogo
                        relative={true}
                        className={`cursor-pointer transition-all duration-300 ${isOpen ? 'h-20 w-20' : 'h-8 w-8'}`}
                    />
                </div>

                {/* Nav Links */}
                {isOpen && (
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        <div className="flex flex-col space-y-2">
                            <NavLink
                                href={route('admin.dashboard')}
                                active={route().current('admin.dashboard')}
                                className='text-blue-900'
                            >
                                Dashboard
                            </NavLink>
                            <NavLink href={route('admin.users.index')} active={route().current('admin.users.index')}>
                                Users
                            </NavLink>

                            {/* Owners Dropdown */}
                            <div>
                                <button
                                    onClick={(e) => {
                                        setOwnerDropdownOpen(!ownerDropdownOpen);
                                        e.stopPropagation();
                                    }}

                                    className="flex items-center justify-between w-full pl-1  text-left rounded "
                                >
                                    <span className='text-sm text-white'>Owners</span>
                                </button>

                                {ownerDropdownOpen && (
                                    <div className="ml-4 mt-2 space-y-1 flex flex-col">
                                        <SidebarLink
                                            href={route('admin.owners')}
                                            active={route().current('admin.owners')}
                                        >
                                            Owners
                                        </SidebarLink>
                                        <SidebarLink
                                            href={route('admin.applications.index')}
                                            active={route().current('admin.applications.index')}
                                        >
                                            Applications
                                        </SidebarLink>
                                        <SidebarLink
                                            href={route('admin.subscriptions.index')}
                                            active={route().current('admin.subscriptions.index')}
                                        >
                                            Subscriptions
                                        </SidebarLink>

                                    </div>
                                )}
                            </div>
                            <div className='relative'>
                                <button
                                    onClick={(e) => {
                                        setBuildingDropdownOpen(!buildingDropdownOpen);
                                        e.stopPropagation();
                                    }}
                                    className="flex items-center justify-between text-white w-full pl-1  text-left "
                                >
                                    <span className='text-sm'>Buildings</span>
                                </button>
                                {buildingDropdownOpen && (
                                    <div className='w-full ml-7'>
                                        <div className=' flex flex-col '>
                                            <SidebarLink
                                                href={route('admin.owner.buildings.index')}
                                                active={route().current('admin.owner.buildings.index')}
                                                className='w-fit'
                                            >
                                                Buildings
                                            </SidebarLink>
                                            <SidebarLink
                                                href={route('admin.owner.buildings.map.destination.index')}
                                                active={route().current('admin.owner.buildings.map.destination.index')}
                                                className='w-fit'
                                            >
                                                Destinations
                                            </SidebarLink>
                                            <SidebarLink
                                                href={route('admin.owner.building.application.index')}
                                                active={route().current('admin.owner.building.application.index')}
                                                className='w-fit'
                                            >
                                                Applications
                                            </SidebarLink>

                                        </div>
                                    </div>
                                )}
                            </div>

                            <NavLink href={route('admin.profile')} active={route().current('admin.profile')}>
                                Profile
                            </NavLink>
                            <NavLink href={route('admin.payment.info.index')} active={route().current('admin.payment.info.index')}>
                                Payment Info
                            </NavLink>
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    post(route('admin.logout.post')); // send POST request
                                }}
                                className="absolute bottom-10 right-7 w-[200px] px-4 py-2 bg-red-100 hover:bg-red-200 rounded-full text-gray-800 hover:text-gray-900 transition-all duration-300"
                            >
                                Logout
                            </button>
                        </div>
                    </nav>
                )}
            </div>
        </aside>
    );
}
