import { useState } from 'react';
import { Link } from '@inertiajs/react';
import NavLink from '@/Components/NavLink';
import SidebarLink from '@/Components/SidebarLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [ownerDropdownOpen, setOwnerDropdownOpen] = useState(false);
    const [buildingDropdownOpen, setBuildingDropdownOpen] = useState(false);

    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };

    return (
        <aside className={`bg-white shadow-md transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
            <div className="h-full flex flex-col">
                {/* Header */}
                <div className="relative h-16  flex items-center justify-center">
                    <img
                        onClick={toggleSidebar}
                        src={`/storage/system/logo/logo-no-bg.png`}
                        alt="BH Logo"
                        className={`cursor-pointer transition-all duration-300 ${isOpen ? 'h-20 w-20' : 'h-10 w-10'}`}
                    />
                    {isOpen && (
                        <button
                            onClick={toggleSidebar}
                            className="absolute right-3 text-indigo-600 text-xl focus:outline-none"
                        >
                            <FontAwesomeIcon icon={faBars} />
                        </button>
                    )}
                </div>

                {/* Nav Links */}
                {isOpen && (
                    <nav className="flex-1 px-4 py-6 space-y-2">
                        <div className="flex flex-col space-y-2">
                            <NavLink href={route('admin.dashboard')} active={route().current('admin.dashboard')}>
                                Dashboard
                            </NavLink>
                            <NavLink href={route('admin.users')} active={route().current('admin.users')}>
                                Users
                            </NavLink>

                            {/* Owners Dropdown */}
                            <div>
                                <button
                                    onClick={() => setOwnerDropdownOpen(!ownerDropdownOpen)}
                                    className="flex items-center justify-between w-full pl-1  text-left rounded hover:bg-gray-100"
                                >
                                    <span className='text-sm'>Owners</span>
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
                                            href={route('admin.owners.requests.index')}
                                            active={route().current('admin.owners.requests.index')}
                                        >
                                            Requests
                                        </SidebarLink>
                                        <div className='relative'>
                                            <button
                                                onClick={() => setBuildingDropdownOpen(!buildingDropdownOpen)}
                                                className="flex items-center justify-between w-full pl-1  text-left rounded hover:bg-gray-100"
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
                                                            href={route('admin.owner.building.application.index')}
                                                            active={route().current('admin.owner.building.application.index')}
                                                            className='w-fit'
                                                        >
                                                            Applications
                                                        </SidebarLink>
                                                        <SidebarLink
                                                            href={route('admin.owner.buildings.create.show')}
                                                            active={route().current('admin.owner.buildings.create.show')}
                                                            className='w-fit'
                                                        >
                                                            Create
                                                        </SidebarLink>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                    </div>
                                )}
                            </div>

                            <NavLink href={route('admin.profile')} active={route().current('admin.profile')}>
                                Profile
                            </NavLink>
                            <NavLink href={route('admin.logout.post')} active={route().current('admin.logout.post')}>
                                Logout
                            </NavLink>
                        </div>
                    </nav>
                )}
            </div>
        </aside>
    );
}
