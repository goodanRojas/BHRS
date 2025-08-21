import { useEffect, useState } from 'react';
import { Link } from '@inertiajs/react';
import NavLink from '@/Components/NavLink';
import SidebarLink from '@/Components/SidebarLink';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState(false);
    const [ownerDropdownOpen, setOwnerDropdownOpen] = useState(false);
    const [buildingDropdownOpen, setBuildingDropdownOpen] = useState(false);

    useEffect(() => {
        const savedSidebarState = sessionStorage.getItem('sidebarState');

        if (savedSidebarState) {
            const state = JSON.parse(savedSidebarState);
            setIsOpen(state.isOpen);
            setOwnerDropdownOpen(state.ownerDropdownOpen);
            setBuildingDropdownOpen(state.buildingDropdownOpen);
        }
    }, []);

    useEffect(() => {
        sessionStorage.setItem('sidebarState', JSON.stringify({
            isOpen,
            ownerDropdownOpen,
            buildingDropdownOpen
        }));
    }, [isOpen, ownerDropdownOpen, buildingDropdownOpen]);
    const toggleSidebar = () => setIsOpen(!isOpen);

    return (
        <aside
            onClick={toggleSidebar}
            className={`bg-gradient-to-b from-indigo-900 to-indigio-100 bg-opacity-80 backdrop-blur-md shadow-md transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'}`}>
            <div className="h-full flex flex-col">
                {/* Header */}
                <div className="relative h-16  flex items-center justify-center">
                    <img
                        src={`/storage/system/logo/logo-no-bg.png`}
                        alt="BH Logo"
                        className={`cursor-pointer transition-all duration-300 ${isOpen ? 'h-20 w-20' : 'h-10 w-10'}`}
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
                            <NavLink href={route('admin.users')} active={route().current('admin.users')}>
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
                                            href={route('admin.owners.requests.index')}
                                            active={route().current('admin.owners.requests.index')}
                                        >
                                            Requests
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
